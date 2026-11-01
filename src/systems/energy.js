import { BUILDING_BY_ID } from "../data/buildings.js";
import { MAP_BY_ID, MAP_SIZE } from "../data/maps.js";
import { getAllLayers, getTechMultiplier, isConnected, isOperational, resolveAnchorIndex } from "../core/state.js";
import { getBuildingOutputMultiplier } from "./production.js";

export function computeEnergy(state, mapId, dt = 0.1) {
  const map = state.maps[mapId];
  const definition = MAP_BY_ID[mapId];
  const consumers = [];
  let supply = 0;
  let demand = 0;

  // 冷却井：相邻（上下左右）运营设施能耗 -15%。
  const cooled = new Set();
  for (const layer of getAllLayers(map)) {
    for (let index = 0; index < layer.buildings.length; index += 1) {
      const building = layer.buildings[index];
      if (!building || building.anchor || building.id !== "coolingWell" || !isOperational(building)) continue;
      if (!isConnected(map, index, layer.depth)) continue;
      const cx = index % MAP_SIZE;
      const cy = Math.floor(index / MAP_SIZE);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx; const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= MAP_SIZE || ny >= MAP_SIZE) continue;
        // 相邻格可能是大型设施的占位格，统一折算到锚点，才能与消费者 key 对上。
        cooled.add(`${layer.depth}:${resolveAnchorIndex(layer.buildings, ny * MAP_SIZE + nx)}`);
      }
    }
  }

  for (const layer of getAllLayers(map)) {
    for (let index = 0; index < layer.buildings.length; index += 1) {
      const building = layer.buildings[index];
      if (!isOperational(building) || !isConnected(map, index, layer.depth)) continue;
      const key = `${layer.depth}:${index}`;
      const buildingDefinition = BUILDING_BY_ID[building.id];
      if (buildingDefinition.produce.energy) {
        let mapMultiplier = 1;
        if (building.id === "solar") mapMultiplier = layer.depth > 0 ? 0 : definition.solar ?? 1;
        if (building.id === "wind") mapMultiplier = layer.depth > 0 ? 0 : definition.wind ?? 1;
        mapMultiplier *= definition.energyModifiers?.[building.id] ?? 1;
        const outputMultiplier = getBuildingOutputMultiplier(state, mapId, index, layer.depth);
        let inputFactor = 1;
        for (const [resource, rate] of Object.entries(buildingDefinition.consume)) {
          const required = rate * outputMultiplier * Math.max(dt, 0.001);
          if (required > 0) inputFactor = Math.min(inputFactor, (map.resources[resource] ?? 0) / required);
        }
        inputFactor = Math.max(0, Math.min(1, inputFactor));
        supply += buildingDefinition.produce.energy
          * outputMultiplier
          * mapMultiplier
          * inputFactor
          * getTechMultiplier(state, "energyMultiplier");
      }
      if (buildingDefinition.energy > 0) {
        const coldMultiplier = layer.depth > 0 ? 1 : definition.hazard?.energyMultiplier ?? (mapId === "ice" ? 1.4 : 1);
        const usage = buildingDefinition.energy * building.count * coldMultiplier * (cooled.has(key) ? 1 - (BUILDING_BY_ID.coolingWell.ability.cooling ?? 0.15) : 1);
        demand += usage;
        consumers.push({ key, index, usage });
      }
    }
  }

  let blackoutFor = demand > supply ? map.blackoutFor + dt : 0;
  let rationing = demand > supply && (map.rationing || blackoutFor >= 30);
  const disabled = [];
  let remainingDemand = demand;

  if (rationing) {
    consumers.sort((left, right) => right.usage - left.usage);
    for (const consumer of consumers) {
      if (remainingDemand <= supply) break;
      disabled.push(consumer.key);
      remainingDemand -= consumer.usage;
    }
  } else if (demand <= supply) {
    blackoutFor = 0;
    rationing = false;
  }

  const efficiency = remainingDemand > supply ? Math.max(0, supply / remainingDemand) : 1;
  return {
    energy: {
      supply,
      demand,
      efficiency: Math.max(0, Math.min(1, efficiency)),
      disabled,
      rationingDemand: remainingDemand,
    },
    blackoutFor,
    rationing,
  };
}
