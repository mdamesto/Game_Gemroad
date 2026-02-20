export interface Area {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  gallery: string[];
  position3D: { x: number; y: number; z: number };
  category: "accommodation" | "dining" | "recreation" | "wellness" | "golf" | "realestate";
}

export const areas: Area[] = [
  {
    id: "pool-fitness",
    title: "Pool & Fitness",
    eyebrow: "Amenities",
    description:
      "A relaxing indoor swimming pool and state-of-the-art fitness center overlooking Primland's magnificent grounds.",
    image:
      "https://www.datocms-assets.com/164288/1767624219-pool-main.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1767624219-pool-main.jpg?auto=format&w=1200",
      "https://www.datocms-assets.com/164288/1767624337-pool.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.062, y: 0.0088, z: 0.0163 },
    category: "wellness",
  },
  {
    id: "stables-saloon",
    title: "Stables Saloon",
    eyebrow: "Amenities",
    description:
      "Primland's former horse stables promises traditional Southern food and music at its best. Available year-round for private parties and events, the rustic Stables Saloon is a regular host of live bluegrass.",
    image:
      "https://www.datocms-assets.com/164288/1759243198-stables-saloon.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1759243198-stables-saloon.jpg?auto=format&w=1200",
      "https://www.datocms-assets.com/164288/1756738615-prim-dine-stables-southernsupper.webp?auto=format&w=1200",
    ],
    position3D: { x: 0.0449, y: 0.0089, z: 0.0044 },
    category: "dining",
  },
  {
    id: "auberge-residences",
    title: "Auberge Residences",
    eyebrow: "Real Estate",
    description:
      "A collection of 25 finely furnished, three, four, and five bedroom retreats designed by Hart Howerton that reflect the timeless beauty of the mountain landscape.",
    image:
      "https://www.datocms-assets.com/164288/1756733927-residences.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756733927-residences.jpg?auto=format&w=1200",
      "https://www.datocms-assets.com/164288/1756913790-int01_overall-living_b3.jpg?auto=format&w=1200",
      "https://www.datocms-assets.com/164288/1756913814-int04_primary-bathroom_b3.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0493, y: 0.0067, z: 0.046 },
    category: "realestate",
  },
  {
    id: "the-estates",
    title: "Custom Estates",
    eyebrow: "Real Estate",
    description:
      "Twenty-six homesites spanning 2 to 5 acres each, set in the most coveted overlook locations on the property. Designed with guidance from Hart Howerton.",
    image:
      "https://www.datocms-assets.com/164288/1756734165-estates.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756734165-estates.jpg?auto=format&w=1200",
    ],
    position3D: { x: 0.0833, y: 0.0089, z: -0.009 },
    category: "realestate",
  },
  {
    id: "court-side",
    title: "Racquet Sports",
    eyebrow: "Outdoor Pursuits",
    description:
      "Soft-surface tennis courts available for day and night play, with pickleball, padel, and bocce courts arriving in 2027.",
    image:
      "https://www.datocms-assets.com/164288/1756728882-padel.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756728882-padel.jpg?auto=format&w=1200",
    ],
    position3D: { x: 0.0414, y: 0.0089, z: 0.0162 },
    category: "recreation",
  },
  {
    id: "paddleboarding",
    title: "Paddleboarding",
    eyebrow: "Outdoor Pursuits",
    description:
      "Half-day guided kayaking and paddleboarding on the Talbott Reservoir at 2,600 feet of elevation, surrounded by ancient forests.",
    image:
      "https://www.datocms-assets.com/164288/1756728089-watersports.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756728089-watersports.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0158, y: 0.0068, z: -0.0194 },
    category: "recreation",
  },
  {
    id: "all-terrain",
    title: "All-Terrain Exploring",
    eyebrow: "Outdoor Pursuits",
    description:
      "Guided ATV adventures across 12,000 acres of rugged mountain terrain. Wind through oak avenues, splash across streams, and tackle muddy tracks.",
    image:
      "https://www.datocms-assets.com/164288/1756732956-rv.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756732956-rv.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0065, y: 0.0081, z: 0.0195 },
    category: "recreation",
  },
  {
    id: "woodland-trails",
    title: "Woodland Trails",
    eyebrow: "Outdoor Pursuits",
    description:
      "Private trails graded for every intensity, from gentle nature walks to strenuous ridge hikes. Guided by the resort's resident Naturalist.",
    image:
      "https://www.datocms-assets.com/164288/1756732744-hiking.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756732744-hiking.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0656, y: 0.009, z: 0.0103 },
    category: "recreation",
  },
  {
    id: "horseback-riding",
    title: "Horseback Riding",
    eyebrow: "Outdoor Pursuits",
    description:
      "Guided horseback rides along leafy pathways and stony ridges, with mounts suited for every ability level.",
    image:
      "https://www.datocms-assets.com/164288/1756729898-horse-riding.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756729898-horse-riding.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0601, y: 0.0088, z: 0.0117 },
    category: "recreation",
  },
  {
    id: "award-winning-golf",
    title: "Award-Winning Golf",
    eyebrow: "Golf",
    description:
      "A 7,051-yard, 18-hole championship course designed by Donald Steel, ranked the No. 1 public course in Virginia.",
    image:
      "https://www.datocms-assets.com/164288/1756725018-golf.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756725018-golf.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0687, y: 0.007, z: 0.0405 },
    category: "golf",
  },
  {
    id: "fly-fishing",
    title: "Catch & Release Fly Fishing",
    eyebrow: "Outdoor Pursuits",
    description:
      "Three stocked ponds and a six-mile stretch of the Dan River offer world-class catch-and-release fly fishing.",
    image:
      "https://www.datocms-assets.com/164288/1756725891-fishing.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756725891-fishing.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0107, y: 0.0081, z: 0.0076 },
    category: "recreation",
  },
  {
    id: "the-lodge",
    title: "The Lodge",
    eyebrow: "Accommodation",
    description:
      "The central hub of the Primland experience. The Lodge features the Great Hall with soaring ceilings and mountain views, an acclaimed wine room, and fine dining.",
    image:
      "https://www.datocms-assets.com/164288/1753108566-primland-thelodge-thumb.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1753108566-primland-thelodge-thumb.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0694, y: 0.0088, z: 0.0262 },
    category: "accommodation",
  },
  {
    id: "pinnacle-cottages",
    title: "Pinnacle Cottages",
    eyebrow: "Accommodation",
    description:
      "Chalet-like accommodations perched at the mountain's edge offering bird's-eye views of the Blue Ridge with open stone fireplaces.",
    image:
      "https://www.datocms-assets.com/164288/1756735905-pinnacle.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756735905-pinnacle.jpg?auto=format&w=1200",
    ],
    position3D: { x: 0.0068, y: 0.0068, z: -0.0096 },
    category: "accommodation",
  },
  {
    id: "tree-houses",
    title: "Tree Houses",
    eyebrow: "Accommodation",
    description:
      "Perched in the treetops at an elevation of 2,700 feet, these 440-square-foot retreats are crafted from aromatic red cedar.",
    image:
      "https://www.datocms-assets.com/164288/1756726495-tree-houses.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756726495-tree-houses.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0559, y: 0.0088, z: 0.0225 },
    category: "accommodation",
  },
  {
    id: "moonshine-tales",
    title: "Moonshine Tales",
    eyebrow: "Culture",
    description:
      "Cocktails and flights celebrating the rich history of the Appalachian moonshine trade, with live bluegrass music.",
    image:
      "https://www.datocms-assets.com/164288/1756730165-moonshine.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756730165-moonshine.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0824, y: 0.007, z: 0.0412 },
    category: "dining",
  },
  {
    id: "shooting",
    title: "Shooting",
    eyebrow: "Outdoor Pursuits",
    description:
      "Hunting and wingshooting across the estate's vast acreage — deer, turkey, pheasant, quail, and chukar on guided excursions.",
    image:
      "https://www.datocms-assets.com/164288/1756730838-shooting.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756730838-shooting.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0345, y: 0.0088, z: 0.0355 },
    category: "recreation",
  },
  {
    id: "yoga",
    title: "Yoga & Wellness",
    eyebrow: "Wellness",
    description:
      "Nature hikes, guided meditation, and yoga sessions set against mountain panoramas with a wellness menu featuring locally sourced ingredients.",
    image:
      "https://www.datocms-assets.com/164288/1756732493-yoga.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756732493-yoga.jpg?auto=format&w=1200",
    ],
    position3D: { x: 0.0029, y: 0.0084, z: 0.0421 },
    category: "wellness",
  },
  {
    id: "mountaintop-bar",
    title: "Mountaintop Bar",
    eyebrow: "Dining",
    description:
      "An elevated bar experience with panoramic views of the Blue Ridge Mountains. Craft cocktails and fine spirits at 3,000 feet.",
    image:
      "https://www.datocms-assets.com/164288/1756737543-bar.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1756737543-bar.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0082, y: 0.0029, z: 0.0 },
    category: "dining",
  },
  {
    id: "mountaintop-restaurant",
    title: "Mountaintop Restaurant",
    eyebrow: "Dining",
    description:
      "Fine dining at the summit with breathtaking views. Seasonal menus featuring locally sourced ingredients from the Blue Ridge region.",
    image:
      "https://www.datocms-assets.com/164288/1753449358-primland-restaurant.jpg?auto=format&w=800",
    gallery: [
      "https://www.datocms-assets.com/164288/1753449358-primland-restaurant.jpg?auto=format&w=1200",
    ],
    position3D: { x: -0.0123, y: 0.0021, z: 0.0018 },
    category: "dining",
  },
];

export const categoryColors: Record<Area["category"], string> = {
  accommodation: "#a8611a",
  dining: "#c4842d",
  recreation: "#456a4b",
  wellness: "#7a9a6d",
  golf: "#3d5c3a",
  realestate: "#8b7355",
};
