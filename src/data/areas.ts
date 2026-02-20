export interface Area {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  gallery: string[];
  tags: string[];
  position3D: { x: number; y: number; z: number };
  category: "frost" | "forest" | "volcanic" | "desert" | "arcane";
}

export const areas: Area[] = [
  // ── Frost / Ice (north) ─────────────────────────────────────────────
  {
    id: "frostpeak-citadel",
    title: "Frostpeak Citadel",
    eyebrow: "Frost Lands",
    description:
      "An ancient fortress carved into the heart of a glacier. Its frozen spires catch the northern lights, and its vaults are said to hold relics from the Age of Winter.",
    image: "",
    gallery: [],
    tags: ["Dungeon", "Lore", "Boss Fight"],
    position3D: { x: -0.02, y: 0, z: -0.108 },
    category: "frost",
  },
  {
    id: "frozen-falls",
    title: "Frozen Falls",
    eyebrow: "Frost Lands",
    description:
      "A colossal waterfall suspended in time by an eternal frost spell. Behind the ice curtain, a hidden cave network shelters rare frost crystals and ice elementals.",
    image: "",
    gallery: [],
    tags: ["Exploration", "Resources", "Hidden Path"],
    position3D: { x: -0.08, y: 0, z: -0.092 },
    category: "frost",
  },
  {
    id: "glacial-expanse",
    title: "Glacial Expanse",
    eyebrow: "Frost Lands",
    description:
      "A vast, wind-swept tundra stretching across the northern reaches. Frost wolves roam in packs, and ancient bones jut from the permafrost like forgotten monuments.",
    image: "",
    gallery: [],
    tags: ["Open World", "Hunting", "Survival"],
    position3D: { x: 0.05, y: 0, z: -0.1 },
    category: "frost",
  },

  // ── Forest / Jungle (west) ─────────────────────────────────────────
  {
    id: "emerald-canopy",
    title: "Emerald Canopy",
    eyebrow: "Verdant Wilds",
    description:
      "A thriving treetop settlement woven between the giant canopy trees. Rope bridges connect thatched platforms where the forest dwellers trade rare herbs and enchanted wood.",
    image: "",
    gallery: [],
    tags: ["Village", "Trading", "Quest Hub"],
    position3D: { x: -0.14, y: 0, z: -0.027 },
    category: "forest",
  },
  {
    id: "serpent-river",
    title: "Serpent River",
    eyebrow: "Verdant Wilds",
    description:
      "A winding river that snakes through the densest part of the jungle. Its emerald waters hide giant serpents and lead to forgotten temples overgrown with vines.",
    image: "",
    gallery: [],
    tags: ["Water Route", "Fishing", "Danger Zone"],
    position3D: { x: -0.12, y: 0, z: -0.045 },
    category: "forest",
  },
  {
    id: "ancient-grove",
    title: "Ancient Grove",
    eyebrow: "Verdant Wilds",
    description:
      "A sacred clearing where the oldest trees in the world still whisper prophecies. Druids gather here during solstice to commune with the spirit of the forest.",
    image: "",
    gallery: [],
    tags: ["Sacred Site", "Lore", "Magic"],
    position3D: { x: -0.16, y: 0, z: 0.005 },
    category: "forest",
  },
  {
    id: "mangrove-shore",
    title: "Mangrove Shore",
    eyebrow: "Verdant Wilds",
    description:
      "Where the jungle meets the ocean, tangled roots form a labyrinth of tidal pools. Bioluminescent creatures light the shallows at night, and smugglers use the maze to hide their boats.",
    image: "",
    gallery: [],
    tags: ["Coastal", "Stealth", "Night Event"],
    position3D: { x: -0.168, y: 0, z: 0.04 },
    category: "forest",
  },

  // ── Volcanic / Mountains (center) ──────────────────────────────────
  {
    id: "dragons-maw",
    title: "Dragon's Maw",
    eyebrow: "Scorched Peaks",
    description:
      "The island's active volcano, its crater glowing with molten lava. Ancient dragons once nested in its caldera, and their fire-touched eggs still smolder in hidden alcoves.",
    image: "",
    gallery: [],
    tags: ["Boss Fight", "Endgame", "Legendary Loot"],
    position3D: { x: -0.025, y: 0, z: -0.038 },
    category: "volcanic",
  },
  {
    id: "ember-forge",
    title: "Ember Forge",
    eyebrow: "Scorched Peaks",
    description:
      "A dwarven smithy built into the volcanic rock, powered by rivers of magma. The finest weapons and armor on the island are hammered here from obsidian and dragonscale.",
    image: "",
    gallery: [],
    tags: ["Crafting", "Upgrades", "NPC"],
    position3D: { x: -0.055, y: 0, z: -0.015 },
    category: "volcanic",
  },
  {
    id: "obsidian-pass",
    title: "Obsidian Pass",
    eyebrow: "Scorched Peaks",
    description:
      "A treacherous mountain pass carved through volcanic glass. The narrow trail connects the northern frost lands to the southern lowlands, guarded by stone golems.",
    image: "",
    gallery: [],
    tags: ["Passage", "Combat", "Shortcut"],
    position3D: { x: 0.005, y: 0, z: -0.025 },
    category: "volcanic",
  },

  // ── Desert (east) ──────────────────────────────────────────────────
  {
    id: "sandstone-ruins",
    title: "Sandstone Ruins",
    eyebrow: "Golden Wastes",
    description:
      "The crumbling remains of a once-great desert civilization. Half-buried temples still hold traps and treasures, and sand wraiths patrol the corridors at dusk.",
    image: "",
    gallery: [],
    tags: ["Dungeon", "Puzzle", "Treasure"],
    position3D: { x: 0.1, y: 0, z: -0.04 },
    category: "desert",
  },
  {
    id: "whispering-dunes",
    title: "Whispering Dunes",
    eyebrow: "Golden Wastes",
    description:
      "Endless rolling sand dunes that sing in the wind. Nomadic traders cross this expanse on armored sand beetles, and mirages lure the unwary into quicksand traps.",
    image: "",
    gallery: [],
    tags: ["Open World", "Mount", "Random Events"],
    position3D: { x: 0.12, y: 0, z: -0.012 },
    category: "desert",
  },
  {
    id: "sun-temple",
    title: "Temple of the Sun",
    eyebrow: "Golden Wastes",
    description:
      "A golden pyramid that channels the desert sun into pure energy. Its priests guard an ancient solar relic capable of scorching entire armies — or healing mortal wounds.",
    image: "",
    gallery: [],
    tags: ["Sacred Site", "Lore", "Boss Fight"],
    position3D: { x: 0.08, y: 0, z: 0.005 },
    category: "desert",
  },
  {
    id: "oasis-of-echoes",
    title: "Oasis of Echoes",
    eyebrow: "Golden Wastes",
    description:
      "A lush oasis hidden among the dunes where time flows differently. Travelers rest here to recover, but linger too long and the echoes of past visitors begin to whisper secrets — and lies.",
    image: "",
    gallery: [],
    tags: ["Rest Point", "Trading", "Side Quest"],
    position3D: { x: 0.14, y: 0, z: 0.02 },
    category: "desert",
  },

  // ── Arcane / Crystal (south) ───────────────────────────────────────
  {
    id: "arcane-nexus",
    title: "Arcane Nexus",
    eyebrow: "Crystal Veil",
    description:
      "The pulsing heart of the island's magic, where ley lines converge in a storm of violet energy. Mages who enter the nexus can amplify their powers — at great personal risk.",
    image: "",
    gallery: [],
    tags: ["Magic", "Endgame", "Power-Up"],
    position3D: { x: -0.045, y: 0, z: 0.06 },
    category: "arcane",
  },
  {
    id: "crystal-spires",
    title: "Crystal Spires",
    eyebrow: "Crystal Veil",
    description:
      "Towering crystal formations that hum with arcane resonance. Their facets refract moonlight into prismatic beams that reveal hidden glyphs and unlock sealed portals.",
    image: "",
    gallery: [],
    tags: ["Exploration", "Puzzle", "Night Event"],
    position3D: { x: -0.02, y: 0, z: 0.05 },
    category: "arcane",
  },
  {
    id: "enchanted-mists",
    title: "Enchanted Mists",
    eyebrow: "Crystal Veil",
    description:
      "A valley perpetually shrouded in purple fog. Reality bends within the mists — paths shift, time loops, and spectral guardians test the resolve of those who seek the Veil's core.",
    image: "",
    gallery: [],
    tags: ["Labyrinth", "Lore", "Hidden Boss"],
    position3D: { x: -0.09, y: 0, z: 0.075 },
    category: "arcane",
  },
];

export const categoryColors: Record<Area["category"], string> = {
  frost: "#7ec8e3",
  forest: "#4a9e5c",
  volcanic: "#e8632b",
  desert: "#d4a843",
  arcane: "#b45ce6",
};
