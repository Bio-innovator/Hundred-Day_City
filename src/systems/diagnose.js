import { RESOURCE_NAMES, isConnected, isOperational } from "../core/state.js";
import { BUILDING_BY_ID } from "../data/buildings.js";

export function diagnose(state, mapId = state.currentMap) {
  const map = state.maps[mapId];
  const depth = map.currentDepth ?? 0;
  const buildings = map.buildings.filter(Boolean);

  const hasExtraction = buildings.some((building) => BUILDING_BY_ID[building.id]?.category === "extraction");
  if (!hasExtraction) {
    return { code: "no-extraction", text: "没有采集节点，资源不会增长" };
  }

  if (map.energy.supply < map.energy.demand) {
    return { code: "low-power", text: `电力不足，全图产出降至 ${Math.round(map.energy.efficiency * 100)}%` };
  }

  let standby = 0;
  for (let index = 0; index < map.buildings.length; index += 1) {
    const building = map.buildings[index];
    if (isOperational(building) && !isConnected(map, index, depth)) standby += 1;
  }
  if (standby > 0) {
    return { code: "standby", text: `${standby} 座设施未接入网络（待机）` };
  }

  for (const building of buildings) {
    if (!isOperational(building)) continue;
    const definition = BUILDING_BY_ID[building.id];
    for (const resource of Object.keys(definition?.consume ?? {})) {
      if ((map.resources[resource] ?? 0) === 0) {
        return { code: "no-input", text: `缺少原料（${definition.name}缺${RESOURCE_NAMES[resource] ?? resource}）` };
      }
    }
  }

  if (buildings.length > 0 && buildings.every((building) => building.buildRemaining > 0)) {
    return { code: "building", text: "等待建造完成" };
  }

  return { code: "normal", text: "网络运转中" };
}
