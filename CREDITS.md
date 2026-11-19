# Numatik Metropolis credits

Numatik Metropolis is a fictional, procedural city built for mathematics learning and exploration. Its game logic, map layout, buildings, characters, and interface are original project content.

The offline generator in `scripts/build-city.mjs` can optionally download roads, buildings, parks, water, and rail features from OpenStreetMap's Overpass API. If that option is used, attribution must be shown as **© OpenStreetMap contributors** and the resulting OpenStreetMap database is available under the **Open Database License (ODbL) 1.0**. See <https://www.openstreetmap.org/copyright> and <https://opendatacommons.org/licenses/odbl/1-0/>.

No OpenStreetMap extract is bundled in this repository. The generator automatically uses its built-in procedural grid when the service is unreachable; set `CITY_OFFLINE=1` to choose that fallback explicitly.
