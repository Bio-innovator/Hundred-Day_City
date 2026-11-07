# Hundred-Day City

English | [简体中文](README.md)

A pixel-art base builder and multi-map logistics idle game. Build facilities, run trade routes, and put civilization's backup on the lunar farside within one hundred days.

Play in browser: https://bio-innovator.github.io/Hundred-Day_City/

## Background

After the solar storms, surface civilization collapsed within thirty years. You are the last running AI Compute Center, left in a basement under the Ashen Plain with one standing order: preserve civilization.

You have no hands. You build facilities and run trade routes until the scattered ruins become one network. In one hundred days the next Coronal Pulse sweeps the surface. Before that, the backup has to reach the lunar farside.

## First 5 Minutes

1. Build 2 solar panels. Power first.
2. Build 2 scrapyards. Scrap Steel comes from extraction, not from power.
3. **Do not open with energy only.** Power produces nothing; extraction does. This is the trap everyone falls into.
4. Each resource row shows stock on the left and net change per second on the right. A rate of 0 means output is fully consumed downstream, or suppressed by a brownout.
5. Built in the wrong place? Click the cell and use Demolish in the details panel. You get 35% of the base cost back.

The first run walks you through 4 required steps that advance when you actually do them: place a solar panel, place a scrapyard, reach 20 Scrap Steel. Eight advanced objectives unlock as you meet the systems they teach. Replay everything from Settings → About.

## Why Resources Stall

The map toolbar prints a live diagnosis. Check in this order:

1. **No extraction facility.** Build a scrapyard, mine, or bioreactor. Generators alone never move resources.
2. **Not enough power.** Add solar, wind, or other generators. A long shortage starts load shedding on the hungriest consumers.
3. **Missing input.** A smelter without Scrap Steel is idle. Check that upstream extraction is finished and powered.
4. **Still under construction.** Every facility is scaffolding. Wait for the progress bar.
5. If all of the above is fine, the toolbar reads "network running".

Biomass pinned at 0 is not always a bug. When chemical plants consume everything a bioreactor makes, the net rate is zero. The resource row shows gross output and gross consumption separately.

## Controls

- Pick a blueprint on the left, click an empty cell. Large facilities occupy 2×2, 3×3, or 5×5; edge and overlap conflicts are reported before you pay.
- Click a finished facility to upgrade. Output ×1.6, and the damage multiplier from Coronal Pulses rises with it — the exact risk is printed in the details panel.
- Hold Ctrl and scroll over the map to zoom, anchored on the cell under the cursor. On touch, pinch with two fingers. The 1× / 2× / 3× buttons in Settings remain the fallback.
- ▲ / ▼ on the map switches underground depth. The top bar holds Research, Network, Endgame, and Settings; on mobile the bottom bar switches Build, Map, Research, Logistics, and Log.
- Saves export as a dated file, import by drag and drop, and still accept Base64 text. Imports show a summary first, back up your current run, then overwrite.

Drag the map to pan (moves beyond 4px never build). Press `R`, `Ctrl + 0`, or the `⌖` button on the map toolbar to reset the view to centred at 100%. With a blueprint selected, hovering draws the full footprint: cyan plus a translucent ghost when buildable, red when blocked.

The game is fully paused while the page is closed: no production, no day counter, no disasters.

### Shortcuts

| Key | Action |
|---|---|
| `Space` | Pause / resume (ignored while a dialog is open) |
| `1` / `2` / `4` | Set speed |
| `B` | Toggle the build panel |
| `R` / `Ctrl + 0` | Reset the view |
| `Esc` | Close the dialog |
| `?` / `H` | This shortcut list |

## Core Rules

- **Brownouts scale output, they do not stop the map.** Efficiency becomes `supply / demand`. After 30 seconds of shortage, the largest consumers are shed first.
- One in-game day is 90 seconds at 1× speed. One hundred days is roughly 150 minutes.
- Every map has its own grid, stock, hazard pressure, and Transit Hub. Resources cross maps only by Trade Route.
- Routes have capacity, delay, and loss. A pulse can cut them; reconnecting costs scrap.
- A Coronal Pulse is warned one day ahead and deals 50%–70% of max HP to an unprotected facility. Repeated destruction on the same cell builds resistance, and Fortification adds more. Underground facilities ignore pulses but produce 70%.
- Ash Storms arrive every 180–300 seconds and last 20–30 seconds: 50% output, ash particles at the screen edge.
- **Connectivity matters.** A facility only runs while it is reachable from a network source: the Compute Center on Ash Plains, a Transit Hub on other maps, a Shaft Elevator underground, a Space Station in orbit. Disconnected facilities go on standby — no output, no power draw. The map status text is clickable and jumps to the first problem facility.
- Launch chain: launchpad → rocket factory → structural assembly → fuel loading → launch → lunar landing → Data Core city.
- Three endings: Back Up Civilization, Stay (unlocks on Day 100), Upload (needs the upload tech). After any ending you can start New Game+ and keep tech and Compute Center level.

## Underground and Large Facilities

- A blast charge detonates 10 seconds after placement, opens the next depth, and clears a 3×3 pocket around the blast point.
- Underground supports convert adjacent rock into buildable ground. Depth is capped at 3.
- No sunlight and no storms underground: solar and wind produce nothing, extraction produces ×1.5.
- Collapses happen at random and turn a cell back into rock, burying whatever stood there.
- The 5×5 launchpad and rocket factory, the 3×3 orbital elevator and fuel plant, and the 2×2 assembler, chip fab, and Data Core all count adjacency and damage as one footprint.
- Achievements and their quotations are written to the watch log and shown as a non-modal card when unlocked. The full list lives in the Achievements entry on the top bar.

### Mirror Shield

- Costs 120 metal · 30 chip · 40 rare, 120 HP, needs `tech_hardening`.
- Gives every surrounding cell (8 directions) −6% pulse damage per shield, capped at −45% per cell. It does not protect itself.
- The shield must be connected and powered: standby or load-shedding drops its reduction to zero — a deliberate risk.
- Reduction stacks with cell resistance and Fortification, still capped at 90%. It does not offset the `2^(Lv−1)` stack risk; its job is protecting key nodes.

### Underground and Space Facilities

| Facility | Layer | Size | Effect |
|---|---|---|---|
| Deep Mine | Underground | 2×2 | Rare +1.2/s, 25 power |
| Geothermal Well | Underground | 1×1 | Energy +20/s, weather-independent |
| Fungal Farm | Underground | 2×2 | Biomass +2/s, no sunlight |
| Shaft Elevator | Underground | 2×2 | Underground network source, one per map |
| Support Pillar | Underground | 1×1 | Opens a 3×3 rock area, stackable |
| Cooling Well | Underground | 1×1 | Adjacent facilities use 15% less power |
| Space Station | Orbit | 3×3 | +1500 storage, orbit network source |
| Solar Satellite | Orbit | 2×2 | Energy +40/s |
| Relay Station | Orbit | 1×1 | Routes through it carry 25% more |
| Regolith Drill | Farside | 1×1 | Regolith +1/s |
| Regolith Printer | Farside | 2×2 | Regolith → alloy at 3:1 |
| Eco Dome | Farside | 2×2 | +800 storage, some biomass |
| Cryo Lab | Farside | 3×3 | Compute +5/s |
| Mass Driver | Farside | 5×5 | Farside routes ×2 capacity, half loss |

Orbit and the farside are vacuum: solar panels and wind turbines produce nothing there, so fission, fusion, and solar satellites carry the load. Alloy and regolith are saved with the run.

## Saves

The main save lives in browser `localStorage` and is written every 10 seconds. The save panel exports a dated file, accepts drag and drop, and keeps Base64 text as a fallback. Before overwriting, it shows the cycle, day, facility count, tech count, and save time, then writes a timestamped local backup you can restore.

Save format is v3. Older saves migrate automatically: v1 gains underground layers and facility sizes, and pre-v3 saves stored pulse schedules in days under a 60-second day, so those values are scaled by 2/3. A stats baseline is also recorded so a migrated run cannot accidentally unlock the "never paused" or "never dismantled" hidden achievements.

Restart clears the current cycle, maps, tech, and main save. It asks twice and does not keep New Game+ tech.

## Inspiration

- Concept seed: [These Old Ruins (r/incremental_games)](https://www.reddit.com/r/incremental_games/comments/rk9suu/these_old_ruins/)
- Mechanics notes: [Ucinorn/theseoldruins](https://github.com/Ucinorn/theseoldruins) (README design document only, code is an empty scaffold)
- Visual reference: [WorldBox - God Simulator](https://store.steampowered.com/app/1206560/WorldBox__God_Simulator/)

This game rebuilds those ideas as multi-map network expansion. No code or art is reused.

## License

[MIT License](LICENSE) · Copyright (c) 2026 Bio-innovator
