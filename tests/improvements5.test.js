import test from "node:test";
import assert from "node:assert/strict";
import { BUILDING_BY_ID } from "../src/data/buildings.js";
import { apply, canBuildAt, createInitialState, createMapState, getBuildingResistance, getConnectivity, isConnected } from "../src/core/state.js";
import { migrateAndValidate } from "../src/save/storage.js";
import { ACHIEVEMENTS, getNewAchievements, getVisibleAchievements } from "../src/systems/achievements.js";
import { computeEnergy } from "../src/systems/energy.js";
import { computeProduction } from "../src/systems/production.js";
import { getRouteParameters } from "../src/systems/logistics.js";
import { MAP_SIZE } from "../src/data/maps.js";

function fund(state, mapId = "ash") {
  Object.assign(state.maps[mapId].resources, { steel: 5000, metal: 5000, biomass: 5000, chem: 5000, chip: 5000, rare: 5000, alloy: 5000, regolith: 5000 });
}

function place(state, mapId, index, buildingId, depth = 0) {
  const response = apply(state, { type: "BUILD", mapId, index, buildingId, depth });
  assert.equal(response.ok, true, response.message);
  const layer = state.maps[mapId].layers.find((item) => item.depth === depth);
  layer.buildings[index].buildRemaining = 0;
}

test("镜面防御罩可为周围八格提供叠加减免并受 45% 上限约束", () => {
  const state = createInitialState({ seed: 92 });
  const map = state.maps.ash;
  fund(state);
  state.techs.push("tech_hardening");
  place(state, "ash", 100, "solar");
  place(state, "ash", 99, "mirrorShield");
  place(state, "ash", 101, "mirrorShield");
  place(state, "ash", 75, "mirrorShield");
  const energy = computeEnergy(state, "ash", 0.1);
  assert.equal(energy.energy.disabled.length, 0, `限电导致护盾失效: ${JSON.stringify(energy.energy)}`);
  assert.equal(getBuildingResistance(state, "ash", 100, 0), 0.18);
  assert.equal(BUILDING_BY_ID.mirrorShield.ability.shield, 0.06);
  // 规格：护盾对自身无效。
  assert.equal(getBuildingResistance(state, "ash", 99, 0), 0, "镜面罩不应保护自己");
});

test("连通模式：运营中设施从网络源可达，且诊断不污染状态", () => {
  const state = createInitialState({ seed: 93 });
  fund(state);
  place(state, "ash", 10, "solar");
  assert.ok(getConnectivity(state.maps.ash, 0).has(10));
  assert.ok(isConnected(state.maps.ash, 10, 0));
  assert.ok(computeEnergy(state, "ash", 0.1).energy.supply > 0);
});

test("地下孤岛设施进入待机：不产出、不耗电", () => {
  const state = createInitialState({ seed: 95 });
  fund(state);
  state.techs.push("tech_elevator");
  // 两处爆破，形成两个互不相通的地下区域。
  const blast = (index) => {
    const response = apply(state, { type: "BUILD", mapId: "ash", index, buildingId: "blastCharge" });
    assert.equal(response.ok, true, response.message);
  };
  blast(100);
  blast(400);
  apply(state, { type: "BUILD_TICK", dt: 20 });
  apply(state, { type: "SWITCH_LAYER", mapId: "ash", depth: 1 });
  const layer1 = state.maps.ash.layers.find((item) => item.depth === 1);
  assert.ok(layer1, "地下层应已打通");
  // A 区：竖井升降机（网络源）；B 区：菌毯农场（孤岛）。
  place(state, "ash", 100, "shaftElevator", 1);
  place(state, "ash", 400, "fungalFarm", 1);
  assert.ok(isConnected(state.maps.ash, 100, 1), "竖井应连通");
  assert.equal(isConnected(state.maps.ash, 400, 1), false, "孤岛应待机");
  const production = computeProduction(state, "ash", 0.1);
  assert.ok(!Object.keys(production.deltas).includes("biomass"), "待机设施不应产出");
  assert.equal(production.deltas.energy ?? 0, 0, "地下设施不应有能量产出");
});

test("深度门：地下设施不能建在地表，支撑柱可撑开岩层", () => {
  const state = createInitialState({ seed: 96 });
  fund(state);
  state.techs.push("tech_geothermal", "tech_hardening");
  const surfaceDeny = canBuildAt(state, "ash", 150, "geothermalWell", 0);
  assert.equal(surfaceDeny.ok, false);
  const blast = apply(state, { type: "BUILD", mapId: "ash", index: 200, buildingId: "blastCharge" });
  assert.equal(blast.ok, true, blast.message);
  apply(state, { type: "BUILD_TICK", dt: 20 });
  const deepAllow = canBuildAt(state, "ash", 200, "geothermalWell", 1);
  assert.equal(deepAllow.ok, true, deepAllow.message);
  // 支撑柱解锁 3×3：在已解锁区建柱，周围岩层变可建。
  place(state, "ash", 200, "supportPillar", 1);
  const layer1 = state.maps.ash.layers.find((item) => item.depth === 1);
  assert.equal(layer1.unlocked[200 - MAP_SIZE], true, "支撑柱应解锁正上方格");
});

test("冷却井使相邻设施能耗降低 15%", () => {
  const state = createInitialState({ seed: 97 });
  fund(state);
  state.techs.push("tech_geothermal", "tech_deep_drill1");
  const blast = apply(state, { type: "BUILD", mapId: "ash", index: 200, buildingId: "blastCharge" });
  assert.equal(blast.ok, true, blast.message);
  apply(state, { type: "BUILD_TICK", dt: 20 });
  place(state, "ash", 201, "geothermalWell", 1); // 供能 +20，能耗 0
  place(state, "ash", 199, "deepMine", 1);        // 2×2：199/200/223/224，能耗 25
  place(state, "ash", 225, "coolingWell", 1);     // 与矿井相邻（224 的右侧邻居）
  const cooled = computeEnergy(state, "ash", 0.1);
  const expected = 25 * 0.85 + 2; // 矿井折减 + 冷却井自身
  assert.equal(Number(cooled.energy.demand.toFixed(2)), Number(expected.toFixed(2)), `需求应为 ${expected}`);
});

test("中继站提升商路容量，质量驱动器翻倍并减半损耗", () => {
  const state = createInitialState({ seed: 98 });
  state.maps.orbit = createMapState("orbit", state.seed);
  state.maps.moon = createMapState("moon", state.seed);
  state.unlockedMaps.push("orbit", "moon");
  fund(state, "orbit"); fund(state, "moon");
  state.techs.push("tech_logistics", "tech_rocketry", "tech_space1");
  place(state, "orbit", 40, "hub");
  place(state, "moon", 40, "hub");
  const add = apply(state, { type: "ROUTE_ADD", from: "orbit", to: "moon", resource: "steel" });
  assert.equal(add.ok, true, add.message);
  const route = state.routes[0];
  const base = getRouteParameters(state, route);
  place(state, "orbit", 60, "relayStation");
  const relayed = getRouteParameters(state, route);
  assert.equal(Number(relayed.capacity.toFixed(2)), Number((base.capacity * 1.25).toFixed(2)));
  place(state, "moon", 100, "massDriver");
  const driven = getRouteParameters(state, route);
  assert.equal(Number(driven.capacity.toFixed(2)), Number((relayed.capacity * 2).toFixed(2)));
  assert.ok(driven.loss < relayed.loss, "质量驱动器应降低损耗");
});

test("旧档 60 秒/天的脉冲日程会按 2/3 迁移", () => {
  const state = createInitialState({ seed: 94 });
  state.version = 2; // 真正的旧档
  state.elapsed = 600;
  state.day = Math.floor(state.elapsed / 90) + 1;
  state.nextPulseDay = 12;
  state.lastWarningDay = 6;
  const payload = { version: 2, savedAt: Date.now(), state };
  const restored = migrateAndValidate(payload);
  assert.equal(restored.nextPulseDay, 8);
  assert.equal(restored.lastWarningDay, 4);
  assert.ok(restored.nextPulseDay > restored.day);
});

test("老档首次载入新版本记录统计起点，且新档不受门限影响", () => {
  const state = createInitialState({ seed: 99 });
  state.version = 2; // 模拟真正的旧档
  state.elapsed = 700;
  state.rocket.stage = "landed";
  const restored = migrateAndValidate({ version: 2, savedAt: Date.now(), state });
  assert.equal(restored.stats.trackedSince, 700);
  const fresh = createInitialState({ seed: 1 });
  assert.equal(fresh.stats.trackedSince, 0);
});

test("全程型隐藏成就只在着陆且过了统计起点后判定", () => {
  const state = createInitialState({ seed: 91 });
  state.stats.trackedSince = 0;
  state.rocket.stage = "landed";
  state.stats.pausesUsed = 0;
  state.stats.dismantled = 0;
  state.elapsed = 10;
  const ids = getNewAchievements(state).map((item) => item.id);
  assert.ok(ids.includes("pause-free"));
  assert.ok(ids.includes("no-demolition"));
  // 统计起点在未来 → 不判定。
  state.stats.trackedSince = 100;
  const gated = getNewAchievements(state).map((item) => item.id);
  assert.ok(!gated.includes("pause-free"));
});

test("重复暂停只计一次，恢复不计入", () => {
  const state = createInitialState({ seed: 89 });
  apply(state, { type: "SET_SETTING", key: "paused", value: true });
  apply(state, { type: "SET_SETTING", key: "paused", value: true });
  apply(state, { type: "SET_SETTING", key: "paused", value: false });
  assert.equal(state.stats.pausesUsed, 1);
});

test("隐藏成就未解锁时不渲染，解锁后带标记出现", () => {
  const state = createInitialState({ seed: 90 });
  const lockedVisible = getVisibleAchievements(state).map((item) => item.id);
  assert.ok(!lockedVisible.includes("pause-free"), "未解锁的隐藏成就不应出现");
  assert.ok(lockedVisible.includes("moon-vanguard"), "明面成就应出现");
  state.achievements.push("pause-free");
  const unlockedVisible = getVisibleAchievements(state).map((item) => item.id);
  assert.ok(unlockedVisible.includes("pause-free"));
  assert.ok(ACHIEVEMENTS.find((item) => item.id === "pause-free").hidden);
});
