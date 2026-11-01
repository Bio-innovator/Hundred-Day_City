import { BUILDING_BY_ID } from "../data/buildings.js";
import { isOperational } from "../core/state.js";


function completedBuildings(state) {
  return Object.values(state.maps).flatMap((map) => map.buildings.filter((building) => isOperational(building)));
}

// 「全程型」隐藏成就只看本版本（trackedSince）之后的数据，避免老存档补零误发。
function landedTracked(state) {
  return state.rocket.stage === "landed" && (state.stats.trackedSince === 0 || state.elapsed > state.stats.trackedSince);
}

export const ACHIEVEMENTS = [
  {
    id: "first-ignition",
    name: "第一次点火",
    description: "建成第一座能源设施。",
    quoteId: "wilde-stars",
    test: (state) => completedBuildings(state).some((building) => BUILDING_BY_ID[building.id]?.category === "energy"),
  },
  {
    id: "first-line",
    name: "第一条产线",
    description: "同一张地图同时拥有采集与加工设施。",
    quoteId: "haldane-universe",
    test: (state) => Object.values(state.maps).some((map) => {
      const categories = new Set(map.buildings.filter((building) => isOperational(building)).map((building) => BUILDING_BY_ID[building.id]?.category));
      return categories.has("extraction") && categories.has("processing");
    }),
  },
  {
    id: "first-blackout",
    name: "第一次断电",
    description: "首次出现供给低于需求。",
    quoteId: "clarke-magic",
    test: (state) => Object.values(state.maps).some((map) => map.energy.demand > map.energy.supply),
  },
  {
    id: "first-pulse",
    name: "第一次脉冲",
    description: "撑过第一次日冕脉冲。",
    quoteId: "nietzsche-stronger",
    test: (state) => state.stats.pulses >= 1,
  },
  {
    id: "first-research",
    name: "重新点亮知识",
    description: "完成第一项科技。",
    quoteId: "bacon-knowledge",
    test: (state) => state.techs.length >= 1,
  },
  {
    id: "first-trade",
    name: "跨图联网",
    description: "建成第一条商路。",
    quoteId: "anonymous-network",
    test: (state) => state.routes.length >= 1,
  },
  {
    id: "first-upgrade",
    name: "深层升级",
    description: "首次把设施升级到 Lv.2。",
    quoteId: "anonymous-first",
    test: (state) => Object.values(state.maps).some((map) => map.buildings.some((building) => (building?.count ?? 0) >= 2)),
  },
  {
    id: "underground-pioneer",
    name: "地下开拓者",
    description: "首次打通地下层。",
    quoteId: "anonymous-first",
    test: (state) => Object.values(state.maps).some((map) => (map.layers?.length ?? 0) > 1),
  },
  {
    id: "mega-structure",
    name: "巨型工程",
    description: "建成第一座 5×5 设施。",
    quoteId: "clarke-magic",
    test: (state) => Object.values(state.maps).some((map) => map.buildings.some((building) => building && !building.anchor && (building.size?.w ?? 1) >= 5)),
  },
  {
    id: "moon-vanguard",
    name: "月背先遣",
    description: "运载器在月背着陆。",
    quoteId: "armstrong-step",
    test: (state) => state.rocket.stage === "landed",
  },
  {
    id: "hoarder",
    name: "仓鼠症",
    description: "任一资源库存 ≥ 10000。",
    quoteId: "wilde-stars",
    test: (state) => Object.values(state.maps).some((map) => Object.values(map.resources).some((value) => value >= 10000)),
  },
  {
    id: "lv10",
    name: "十级学者",
    description: "任一设施升到 Lv.10。",
    quoteId: "bacon-knowledge",
    test: (state) => Object.values(state.maps).some((map) => map.buildings.some((building) => (building?.count ?? 0) >= 10)),
  },
  {
    id: "full-spectrum",
    name: "全谱系",
    description: "七个类别各建成一座设施。",
    quoteId: "haldane-universe",
    test: (state) => {
      const categories = new Set();
      for (const map of Object.values(state.maps)) {
        for (const building of map.buildings) if (isOperational(building)) categories.add(BUILDING_BY_ID[building.id]?.category);
      }
      return categories.size >= 7;
    },
  },
  {
    id: "paperclip",
    name: "回形针",
    description: "累计产出废钢 ≥ 1,000,000。",
    quoteId: "anonymous-network",
    test: (state) => state.stats.steelProduced >= 1_000_000,
  },
  {
    id: "night-owl",
    name: "守夜人",
    description: "单局真实游玩 ≥ 60 分钟。",
    quoteId: "nietzsche-stronger",
    test: (state) => state.stats.sessionRealSeconds >= 3600,
  },
  {
    id: "no-scrapyard",
    name: "无米之炊",
    description: "第一次脉冲前一座废料场都没建；拆掉至少 2 座后才建起第一座。",
    quoteId: "anonymous-first",
    hidden: true,
    test: (state) => state.stats.scrapyardsBuilt >= 1 && Boolean(state.stats.firstPulseNoScrapyard) && state.stats.dismantled >= 2,
  },
  {
    id: "stubborn",
    name: "我就不信",
    description: "资源不足时累计硬点建造卡片 10 次。",
    quoteId: "anonymous-first",
    hidden: true,
    test: (state) => state.stats.cardRejects >= 10,
  },
  {
    id: "wall-gazer",
    name: "面壁者",
    description: "连续 30 分钟没有任何操作（暂停不计）。",
    quoteId: "wilde-stars",
    hidden: true,
    test: (state) => state.stats.idleSeconds >= 1800,
  },
  {
    id: "demolition-addict",
    name: "拆迁上瘾",
    description: "单局累计拆除 100 座设施。",
    quoteId: "nietzsche-stronger",
    hidden: true,
    test: (state) => state.stats.dismantled >= 100,
  },
  {
    id: "flawless-grid",
    name: "白璧无瑕",
    description: "开局到发射从未断电（按本版本起算）。",
    quoteId: "clarke-magic",
    hidden: true,
    test: (state) => landedTracked(state) && state.stats.blackoutSeconds === 0,
  },
  {
    id: "minimal",
    name: "极简主义",
    description: "发射时全网络设施总数 ≤ 40 座。",
    quoteId: "haldane-universe",
    hidden: true,
    test: (state) => landedTracked(state) && state.stats.peakFacilities <= 40,
  },
  {
    id: "hundred-days",
    name: "百日之内",
    description: "DAY ≤ 100 完成发射。",
    quoteId: "armstrong-step",
    hidden: true,
    test: (state) => state.rocket.stage === "landed" && state.day <= 100,
  },
  {
    id: "shield-wall",
    name: "镜花水月",
    description: "单次脉冲中 ≥ 12 格处于镜面罩覆盖且 0 座被毁。",
    quoteId: "clarke-magic",
    hidden: true,
    test: (state) => Boolean(state.stats.shieldWallPulse),
  },
  {
    id: "pause-free",
    name: "时间不等人",
    description: "整局从未显式暂停，并完成发射。",
    quoteId: "anonymous-first",
    hidden: true,
    test: (state) => (state.stats?.pausesUsed ?? 0) === 0 && landedTracked(state),
  },
  {
    id: "no-demolition",
    name: "一锤定音",
    description: "完成发射时从未拆除过设施。",
    quoteId: "anonymous-first",
    hidden: true,
    test: (state) => (state.stats?.dismantled ?? 0) === 0 && landedTracked(state),
  },
];

export function getVisibleAchievements(state) {
  const unlocked = new Set(state.achievements ?? []);
  return ACHIEVEMENTS.filter((achievement) => !achievement.hidden || unlocked.has(achievement.id));
}

export function getNewAchievements(state) {
  const unlocked = new Set(state.achievements ?? []);
  return ACHIEVEMENTS.filter((achievement) => !unlocked.has(achievement.id) && achievement.test(state));
}
