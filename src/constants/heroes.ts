import { Hero } from "../types";

export const HEROES: Hero[] = [
  {
    id: "iron-man",
    name: "Iron Man",
    role: "Duelist",
    description: "A high-mobility aerial combatant capable of raining destruction from above.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/47/Iron_Man_%28circa_2018%29.png",
    stats: { difficulty: 2, damage: 5, survivability: 2, mobility: 5, utility: 2 },
    abilities: [
      { name: "Repulsor Blast", description: "Standard energy projectile.", type: "Primary" },
      { name: "Unibeam", description: "Powerful chest beam that deals massive damage.", type: "Secondary" },
      { name: "Invincible Pulse", description: "Massive energy explosion in an area.", type: "Ultimate" }
    ],
    teamUps: [
      { heroId: "hulk", description: "Gamma-charged repulsors deal extra damage." }
    ]
  },
  {
    id: "hulk",
    name: "Hulk",
    role: "Vanguard",
    description: "An unstoppable force of nature that thrives in the thick of battle.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/aa/Hulk_%28circa_2019%29.png",
    stats: { difficulty: 1, damage: 3, survivability: 5, mobility: 3, utility: 2 },
    abilities: [
      { name: "Smash", description: "Powerful melee strike.", type: "Primary" },
      { name: "Thunderclap", description: "Stuns enemies in a cone.", type: "Secondary" },
      { name: "Worldbreaker", description: "Transform into an even more powerful state.", type: "Ultimate" }
    ],
    teamUps: [
      { heroId: "iron-man", description: "Provides Iron Man with Gamma energy." }
    ]
  },
  {
    id: "luna-snow",
    name: "Luna Snow",
    role: "Strategist",
    description: "A K-Pop star who uses ice and light to heal allies and freeze foes.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c6/Luna_Snow_Marvel_Future_Fight.png",
    stats: { difficulty: 2, damage: 2, survivability: 3, mobility: 3, utility: 5 },
    abilities: [
      { name: "Ice Bolt", description: "Fires ice projectiles that slow enemies.", type: "Primary" },
      { name: "Idol Performance", description: "Heals nearby allies with a song.", type: "Secondary" },
      { name: "Absolute Zero", description: "Freezes all enemies in a large radius.", type: "Ultimate" }
    ],
    teamUps: [
      { heroId: "namor", description: "Water and Ice synergy increases healing." }
    ]
  },
  {
    id: "spider-man",
    name: "Spider-Man",
    role: "Duelist",
    description: "A nimble web-slinger who excels at flanking and crowd control.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/21/Web_of_Spider-Man_Vol_1_129-1.png",
    stats: { difficulty: 3, damage: 4, survivability: 2, mobility: 5, utility: 3 },
    abilities: [
      { name: "Web Shot", description: "Fires webs to slow or trap enemies.", type: "Primary" },
      { name: "Spider-Sense", description: "Passive: Detects nearby enemies.", type: "Passive" },
      { name: "Web Barrage", description: "Rapidly fires webs in all directions.", type: "Ultimate" }
    ],
    teamUps: []
  },
  {
    id: "doctor-strange",
    name: "Doctor Strange",
    role: "Vanguard",
    description: "The Sorcerer Supreme, manipulating space and time to protect allies.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4f/Doctor_Strange_Vol_4_2_Marvel_Comics.png",
    stats: { difficulty: 4, damage: 3, survivability: 4, mobility: 2, utility: 5 },
    abilities: [
      { name: "Daggers of Daorak", description: "Fires magical projectiles.", type: "Primary" },
      { name: "Shield of the Seraphim", description: "Creates a protective barrier.", type: "Secondary" },
      { name: "Eye of Agamotto", description: "Reveals enemies and slows time in an area.", type: "Ultimate" }
    ],
    teamUps: []
  },
  {
    id: "black-panther",
    name: "Black Panther",
    role: "Duelist",
    description: "The King of Wakanda, a deadly melee assassin with vibranium armor.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/9f/Black_Panther_OS_Vol_1_2.png",
    stats: { difficulty: 3, damage: 5, survivability: 3, mobility: 4, utility: 1 },
    abilities: [
      { name: "Vibranium Claws", description: "Rapid melee strikes.", type: "Primary" },
      { name: "Panther's Pounce", description: "Leaps forward, damaging enemies.", type: "Secondary" },
      { name: "Kinetic Burst", description: "Releases stored kinetic energy in a massive AoE.", type: "Ultimate" }
    ],
    teamUps: []
  },
  {
    id: "star-lord",
    name: "Star-Lord",
    role: "Duelist",
    description: "Leader of the Guardians, using elemental blasters and rocket boots.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a7/Star-Lord_%28Marvel_Comics_character%29.jpg",
    stats: { difficulty: 2, damage: 4, survivability: 2, mobility: 4, utility: 2 },
    abilities: [
      { name: "Element Guns", description: "Fires elemental blasts.", type: "Primary" },
      { name: "Rocket Boots", description: "Allows hovering and quick dashes.", type: "Secondary" },
      { name: "Dance Off", description: "Distracts enemies and boosts ally damage.", type: "Ultimate" }
    ],
    teamUps: [
      { heroId: "rocket-raccoon", description: "Increases blaster fire rate." }
    ]
  }
];
