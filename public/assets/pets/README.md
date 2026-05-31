Pet sticker assets live here.

Expected structure:

- `calico/idle.webp`
- `calico/boop.webp`
- `beagle/idle.webp`
- `beagle/boop.webp`

PNG is also fine for early iterations. Current V1 pets use original generated transparent PNGs:

- `calico/idle.png`
- `beagle/idle.png`

Pet System V3 also supports generated sprite sheets:

- `calico/sprite.png`
- `beagle/sprite.png`

Each sprite sheet currently has four horizontal frames: idle, lick, stretch, and jump. The site can still fall back to a static PNG or inline SVG if a pet entry in `content/pets/pets.json` has no sprite.
