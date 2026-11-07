# Hundred-Day City

English | [简体中文](README.md)

A pixel-art base builder and multi-map logistics idle game. Build facilities, run trade routes, and put civilization's backup on the lunar farside within one hundred days.

Play in browser: https://bio-innovator.github.io/Hundred-Day_City/

## Background

After the solar storms, surface civilization collapsed within thirty years. You are the last running AI Compute Center, left in a basement under the Ashen Plain with one standing order: preserve civilization.

You have no hands. You build facilities and run trade routes until the scattered ruins become one network. In one hundred days the next Coronal Pulse sweeps the surface. Before that, the backup has to reach the lunar farside.

## First 5 Minutes

Your first run starts with a guided tutorial that teaches the basics step by step: place a solar panel, place a scrapyard, and raise your Scrap Steel stock to 20. After the tutorial, eight advanced objectives unlock as you meet the systems they teach, covering research, logistics, and disasters. You can replay the whole sequence any time from Settings → About.

A good opening looks like this:

1. Power first. Build 2 solar panels so everything downstream has electricity.
2. Then build 2 scrapyards and start producing Scrap Steel. Resources come from extraction buildings. Generators alone produce nothing, which is the most common beginner mistake.
3. Read the resource rows. Stock sits on the left, net change per second on the right. A rate of 0 means output is fully consumed downstream, or the facility is throttled by a brownout.
4. Built in the wrong place? Click the cell and use Demolish in the details panel to recover 35% of the base cost.

If a resource stops growing for a long time, check in this order: whether you are missing extraction facilities; whether power is sufficient; whether downstream facilities are missing inputs; and whether the facility is still under construction. When none of these apply, the map status reads "network running". Biomass pinned at 0 is not always a bug. When chemical plants consume everything a bioreactor makes, the net rate is zero. The resource row shows gross output and gross consumption separately, so you can tell where the bottleneck is.

## Why Resources Stall

The map toolbar prints a live diagnosis. When something looks stuck, check in this order:

1. **No extraction facility.** Only scrapyards, mines, and bioreactors produce resources. Generators alone never move the numbers.
2. **Not enough power.** Add solar panels or wind turbines. A long shortage starts shedding the hungriest consumers first.
3. **Missing input.** A smelter without Scrap Steel sits idle. Confirm the upstream facility is finished and powered.
4. **Still under construction.** Every facility is scaffolding until its progress bar completes.
5. If all of the above is fine, the toolbar reads "network running".

Biomass pinned at 0 is not always a bug. When chemical plants consume everything a bioreactor makes, the net rate is zero. The resource row shows gross output and gross consumption separately, so you can tell the two apart.

## Controls

- Pick a blueprint on the left, then click an empty cell. Large facilities occupy 2×2, 3×3, or 5×5 as one footprint, and the game warns you before you pay if the placement crosses the edge or overlaps another facility.
- Click a finished facility to upgrade. Output rises to 1.6×, and the damage risk from disasters rises with it. The exact risk is printed in the details panel.
- Hold Ctrl and scroll over the map to zoom, anchored on the cell under the cursor. On touch screens, pinch with two fingers. The 1× / 2× / 3× buttons in Settings remain the fallback.
- ▲ / ▼ on the map switches underground depth. The top bar holds Research, Network, Endgame, and Settings; on mobile, the bottom bar switches between Build, Map, Research, Logistics, and Log.
- Saves export as a dated file, import by drag and drop, and also accept Base64 text. An import always shows a summary and writes a backup of your current run before anything is overwritten.

Drag the map to pan the view. Moves beyond 4px never trigger a build. Press `R`, `Ctrl + 0`, or the `⌖` button on the map toolbar to reset the view to centred at 100%. With a blueprint selected, hovering draws the full footprint: cyan with a translucent ghost when buildable, red when blocked.

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

- Brownouts scale output instead of stopping the map. Efficiency becomes supply divided by demand. After 30 seconds of shortage, the largest consumers are shed first.
- One in-game day is 90 seconds at 1× speed, so one hundred days is roughly 150 minutes.
- Every map has its own grid, stock, hazard pressure, and Transit Hub. Resources cross maps only by Trade Route.
- Routes have capacity, delay, and loss. A pulse can cut a route, and reconnecting costs scrap.
- A Coronal Pulse is warned one day ahead and deals 50% to 70% of max HP to a facility without resistance. Repeated damage on the same cell builds cell resistance, and the Fortification tech adds more. Underground facilities ignore pulses but produce at 70%.
- Ash Storms arrive every 180 to 300 seconds and last 20 to 30 seconds, cutting output by half while ash particles gather at the screen edge.
- Connectivity matters. A facility only runs while it is reachable from a network source: the Compute Center on the Ashen Plains, a Transit Hub on other maps, a Shaft Elevator underground, or a Space Station in orbit. Disconnected facilities go on standby with no output and no power draw. The map status text is clickable and jumps to the first problem facility.
- The launch chain runs in order: launchpad, rocket factory, structural assembly, fuel loading, launch, lunar landing, then building the city around the Data Core.
- Three endings are available: Back Up Civilization, Stay (opens on Day 100), and Upload (requires the consciousness upload tech). After any ending you can start New Game+ and keep your tech and Compute Center level.

## Underground and Large Facilities

- A blast charge detonates 10 seconds after placement, opens the next depth, and clears a 3×3 pocket around the blast point.
- Underground supports convert adjacent rock into buildable ground. Depth is capped at 3.
- There is no sunlight and no storms underground. Solar panels and wind turbines produce nothing, while extraction runs at 1.5× output.
- Collapses happen at random underground, turning a cell back into rock and burying whatever stood there.
- The launchpad and rocket factory occupy 5×5, the orbital elevator and fuel plant occupy 3×3, and the assembler, chip fab, and Data Core occupy 2×2. Each large facility counts adjacency and damage as one footprint.
- Achievements and their quotations are written to the watch log and shown as a card when unlocked. The full list lives under Achievements on the top bar.

### Mirror Shield

- It costs 120 metal, 30 chips, and 40 rare materials, has 120 HP, and requires the Fortification tech.
- Each shield gives the 8 surrounding cells (including diagonals) a 6% pulse damage reduction, capped at 45% per cell. It does not protect itself.
- The shield only works while connected and powered. Standby or load shedding drops its reduction to zero.
- The reduction stacks with cell resistance and Fortification, up to a total cap of 90%. It cannot offset the exponential risk from upgrading, so use it to protect key nodes.
- Selecting a shield highlights the 8 cells it covers.

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

Orbit and the lunar farside are vacuum. Solar panels and wind turbines produce nothing there, so fission plants, fusion plants, and solar satellites carry the power grid. Alloy and regolith are exclusive to orbit and the farside and persist through save and load.

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