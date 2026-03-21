// ========== 仙缘大陆 - 游戏数据定义 ==========

// ===== 类型定义 =====
export interface Realm {
  id: number;
  name: string;
  chineseNum: string;
  lifespan: string;
  feature: string;
  qiNeeded: number;
  breakthroughChance: number;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  emoji: string;
  title: string;
  realm: string;
  skills: string[];
  traits: string;
  relation: string;
  relationLabel: string;
  sect: string;
  treasures?: string[];
  description: string;
}

export interface Treasure {
  id: string;
  name: string;
  emoji: string;
  grade: string;
  stars: number;
  description: string;
  bond?: string;
  attack: number;
  defense: number;
  special: string;
  cost: number;
  owned: boolean;
}

export interface Region {
  id: string;
  name: string;
  emoji: string;
  description: string;
  tag: string;
  dangerLevel: number;
  minRealm: number;
}

export interface Herb {
  id: string;
  name: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
  stars: number;
  effect: string;
  location: string;
  price: number;
}

export interface Sect {
  id: string;
  name: string;
  emoji: string;
  position: string;
  skill: string;
  feature: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily';
  realmRequired: number;
  rewards: { qi?: number; stones?: number; herb?: string; treasure?: string; title?: string };
  target: number;
  emoji: string;
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  target: number;
  reward: string;
  category: string;
}

export interface Skill {
  id: string;
  name: string;
  emoji: string;
  type: 'attack' | 'defense' | 'support';
  element: string;
  description: string;
  qiCost: number;
  realmRequired: number;
  damage?: number;
  healing?: number;
}

export interface AuctionItem {
  id: string;
  name: string;
  currentPrice: number;
  timeLeft: number; // seconds
  bids: number;
  hot: boolean;
  type: 'herb' | 'treasure' | 'material' | 'skill';
}

export interface Title {
  id: string;
  name: string;
  condition: string;
  bonus: string;
  realmRequired: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  self: boolean;
  timestamp: number;
}

// ===== 境界数据 =====
export const REALMS: Realm[] = [
  { id: 1, name: '炼气期', chineseNum: '一', lifespan: '150-200年', feature: '引气入体 · 锤炼肉身', qiNeeded: 100, breakthroughChance: 0.8, description: '修仙第一步，引天地灵气入体，锤炼肉身根基。' },
  { id: 2, name: '筑基期', chineseNum: '二', lifespan: '300-500年', feature: '丹田气海 · 灵气化液', qiNeeded: 500, breakthroughChance: 0.6, description: '丹田凝聚气海，灵气由气态化为液态，踏入修仙正途。' },
  { id: 3, name: '金丹期', chineseNum: '三', lifespan: '800-1000年', feature: '金丹大成 · 法力凝聚', qiNeeded: 2000, breakthroughChance: 0.45, description: '液态灵力凝聚为金丹，法力大涨，已是一方强者。' },
  { id: 4, name: '元婴期', chineseNum: '四', lifespan: '2000-3000年', feature: '元婴出窍 · 可夺舍', qiNeeded: 8000, breakthroughChance: 0.3, description: '金丹化元婴，元神可出窍，已具夺舍之能。' },
  { id: 5, name: '化神期', chineseNum: '五', lifespan: '5000-8000年', feature: '神念化形 · 沟通天地', qiNeeded: 30000, breakthroughChance: 0.2, description: '元婴化神，神念可具现化，沟通天地法则。' },
  { id: 6, name: '炼虚期', chineseNum: '六', lifespan: '万年以上', feature: '身化万千 · 领悟法则', qiNeeded: 100000, breakthroughChance: 0.12, description: '虚实转换，身化万千分身，领悟天地大道法则。' },
  { id: 7, name: '合体期', chineseNum: '七', lifespan: '数万年', feature: '身合大道 · 人法合一', qiNeeded: 400000, breakthroughChance: 0.08, description: '身合大道，人法合一，已是顶尖存在。' },
  { id: 8, name: '大乘期', chineseNum: '八', lifespan: '十万年', feature: '半仙之体 · 可飞升', qiNeeded: 1500000, breakthroughChance: 0.05, description: '半仙之体，具备飞升资格，需渡天劫方可飞升。' },
  { id: 9, name: '渡劫期', chineseNum: '九', lifespan: '随时天劫', feature: '飞升在即 · 承受天劫', qiNeeded: 9999999, breakthroughChance: 0.03, description: '飞升在即，承受天劫考验。成则飞升仙界，败则身死道消。' },
];

// ===== 角色数据 =====
export const CHARACTERS: Character[] = [
  {
    id: 'hanli', name: '韩立', emoji: '⚔️',
    title: '渡劫期（大乘） · 人界修士 → 灵界飞升 → 仙界',
    realm: '渡劫期', skills: ['青元剑诀', '梵圣真魔功', '大五行决'],
    traits: '谨慎低调 · 谋定后动', relation: '南宫婉', relationLabel: '道侣',
    sect: '黄枫谷', treasures: ['掌天瓶', '青竹蜂云剑', '虚天鼎', '玄天斩灵剑'],
    description: '凡人出身，凭借变异木属性天灵根踏上修仙之路。为人谨慎低调，谋定后动，凭借掌天瓶在修仙路上步步为营，逆天改命。'
  },
  {
    id: 'nanwan', name: '南宫婉', emoji: '🌙',
    title: '元婴期 · 掩月宗弟子/长老 · 轮回殿主',
    realm: '元婴期', skills: ['素女轮回功'],
    traits: '绝色美女 · 双修之术', relation: '韩立', relationLabel: '道侣',
    sect: '掩月宗',
    description: '掩月宗绝色女修，修炼素女轮回功，与韩立结为道侣。"轮回尽头，你我终会相见。"'
  },
  {
    id: 'ziyue', name: '紫灵仙子', emoji: '✨',
    title: '炼虚期 · 银月狼族（半妖） · 红颜知己',
    realm: '炼虚期', skills: ['天魔媚功'],
    traits: '绝美容颜 · 歌舞双绝', relation: '韩立', relationLabel: '红颜知己',
    sect: '银月狼族',
    description: '绝美容颜，歌舞双绝，修炼天魔媚功。与韩立是红颜知己，共同经历诸多风雨。'
  },
  {
    id: 'yinyue', name: '银月', emoji: '🐺',
    title: '化神期 · 银月狼族妖修 · 灵宠伙伴',
    realm: '化神期', skills: ['妖族传承'],
    traits: '化身少女 · 记忆残缺', relation: '韩立', relationLabel: '灵宠伙伴',
    sect: '银月狼族', treasures: ['银月弯刀'],
    description: '银月狼族公主，记忆残缺，化身少女跟随韩立。化形之秘暗藏大能，银月血脉觉醒后实力大增。'
  },
  {
    id: 'muxue', name: '墨大夫', emoji: '🧙',
    title: '金丹期 · 越京墨府 · 引路人',
    realm: '金丹期', skills: ['长春功'],
    traits: '老谋深算 · 企图夺舍', relation: '韩立', relationLabel: '师父（亦敌亦友）',
    sect: '越京墨府',
    description: '越京墨府主人。将韩立带入修仙之路，传授长春功。"修仙界弱肉强食，只有活着，才是最大的道理。"'
  },
  {
    id: 'xiangzhili', name: '向之礼', emoji: '🌟',
    title: '化神期 · 人界第一修士',
    realm: '化神期', skills: ['化身万修'],
    traits: '化身万修 · 探寻飞升', relation: '韩立', relationLabel: '前辈',
    sect: '无门无派',
    description: '人界修仙界第一人，化身万千探寻飞升之路。"飞升之路，万中无一。向某不才，愿为天下修士试一试。"'
  },
];

// ===== 法宝数据 =====
export const TREASURES: Treasure[] = [
  {
    id: 'zhangtianping', name: '掌天瓶', emoji: '🏺', grade: '先天至宝', stars: 5,
    description: '又名"小绿瓶"，蕴含时间法则之力，能催熟一切灵药仙草。韩立凭借此宝在修仙路上步步为营，逆天改命。',
    bond: '先天双生（掌天瓶 + 玄天斩灵剑 → 混沌法则觉醒）',
    attack: 0, defense: 0, special: '时间法则: 催熟灵药', cost: 50000, owned: false,
  },
  {
    id: 'xuantianjian', name: '玄天斩灵剑', emoji: '⚔️', grade: '玄天之宝', stars: 5,
    description: '斩灵灭仙，混沌二宝之一。与掌天瓶合称先天双生，威力无穷。',
    bond: '先天双生（与掌天瓶共鸣）',
    attack: 9999, defense: 0, special: '斩灵灭仙', cost: 45000, owned: false,
  },
  {
    id: 'xutianding', name: '虚天鼎', emoji: '🔱', grade: '灵宝', stars: 4,
    description: '虚天殿至宝，内有乾蓝冰焰。攻防一体，威力强大。',
    bond: '虚天三宝（虚天鼎 + 乾蓝冰焰 → 冰系攻击强化）',
    attack: 3000, defense: 5000, special: '乾蓝冰焰', cost: 20000, owned: false,
  },
  {
    id: 'qingzhujian', name: '青竹蜂云剑', emoji: '🗡️', grade: '飞剑', stars: 4,
    description: '108口飞剑组成的剑阵，韩立最强攻击手段之一。剑阵一出，天地变色。',
    bond: '青元剑阵（集齐108口 → 攻击力+300%）',
    attack: 5000, defense: 0, special: '剑阵合击', cost: 15000, owned: false,
  },
  {
    id: 'qingyuanjian', name: '青元剑', emoji: '🔪', grade: '法宝', stars: 3,
    description: '韩立早期所用飞剑，品质不高但意义非凡。',
    attack: 500, defense: 0, special: '基础剑术', cost: 1000, owned: false,
  },
  {
    id: 'jinganzhao', name: '金刚罩', emoji: '🛡️', grade: '法宝', stars: 3,
    description: '防御护体法宝，可抵御金丹期以下攻击。',
    attack: 0, defense: 2000, special: '护体金光', cost: 2000, owned: false,
  },
  {
    id: 'hunyuanchi', name: '混元尺', emoji: '📏', grade: '法宝', stars: 3,
    description: '攻防一体的法宝，可大可小。',
    attack: 1500, defense: 1500, special: '大小如意', cost: 3000, owned: false,
  },
  {
    id: 'wulongzha', name: '五龙铡', emoji: '🐉', grade: '灵宝', stars: 4,
    description: '困敌法宝，五龙齐出，封锁天地。',
    attack: 4000, defense: 2000, special: '五龙封锁', cost: 12000, owned: false,
  },
];

// ===== 地域数据 =====
export const REGIONS: Region[] = [
  { id: 'luanxinghai', name: '乱星海', emoji: '🌊', description: '韩立最初踏入修仙之路的起点，妖兽资源丰富，海域辽阔，暗流涌动。', tag: '起点之地', dangerLevel: 3, minRealm: 1 },
  { id: 'tiannan', name: '天南地区', emoji: '🌸', description: '人界修仙界最繁荣的核心区域，包含越京、燕家堡、掩月宗等重要地点。', tag: '核心区域', dangerLevel: 2, minRealm: 1 },
  { id: 'xutiandian', name: '虚天殿', emoji: '🏰', description: '乱星海最大修仙宗门遗址，内藏虚天鼎与乾蓝冰焰，逆星盟所在。', tag: '上古遗迹', dangerLevel: 4, minRealm: 3 },
  { id: 'kunwushan', name: '昆吾山', emoji: '⛰️', description: '远古修仙遗址，群修争夺古宝之地，危机四伏。', tag: '远古秘境', dangerLevel: 5, minRealm: 4 },
  { id: 'guiwuhaiyu', name: '鬼雾海域', emoji: '🌫️', description: '神秘危险的海域，鬼雾出没，修士陨落之地。', tag: '险地', dangerLevel: 5, minRealm: 3 },
  { id: 'xuesejindi', name: '血色禁地', emoji: '🌿', description: '十年一开的大型禁地，筑基以下方可进入，暗藏掌天瓶。', tag: '十年一开', dangerLevel: 4, minRealm: 1 },
  { id: 'zuimagu', name: '坠魔谷', emoji: '👻', description: '魔气森森的险地，考验修士心性，内藏魔道传承。', tag: '魔道之地', dangerLevel: 4, minRealm: 3 },
  { id: 'wanyaogu', name: '万妖谷', emoji: '🐲', description: '妖族聚居之地，妖丹资源丰富但凶险万分。', tag: '妖族领地', dangerLevel: 4, minRealm: 3 },
];

// ===== 灵药数据 =====
export const HERBS: Herb[] = [
  { id: 'nichangcao', name: '霓裳草', emoji: '🌺', rarity: 'rare', stars: 5, effect: '吸引妖兽', location: '乱星海', price: 500 },
  { id: 'yinjiaozhi', name: '银角芝', emoji: '🍄', rarity: 'rare', stars: 4, effect: '炼制筑基丹', location: '各宗门', price: 300 },
  { id: 'longlinguuo', name: '龙鳞果', emoji: '🐉', rarity: 'legendary', stars: 5, effect: '突破境界（+大量灵气）', location: '昆吾山', price: 5000 },
  { id: 'butiantan', name: '补天丹', emoji: '💊', rarity: 'legendary', stars: 5, effect: '改善资质（+突破概率）', location: '虚天殿', price: 8000 },
  { id: 'wannianxuanbing', name: '万年玄冰', emoji: '❄️', rarity: 'rare', stars: 4, effect: '冰封保存', location: '极北之地', price: 400 },
  { id: 'jiuqulingcan', name: '九曲灵参', emoji: '🌱', rarity: 'legendary', stars: 5, effect: '炼丹圣药（+大量灵气）', location: '深山秘境', price: 6000 },
  { id: 'yusuizhi', name: '玉髓芝', emoji: '🍃', rarity: 'common', stars: 3, effect: '+少量灵气', location: '各地山野', price: 50 },
  { id: 'ziyunhua', name: '紫韵花', emoji: '🌸', rarity: 'rare', stars: 4, effect: '阵法材料', location: '掩月宗', price: 350 },
  { id: 'lingxincao', name: '灵心草', emoji: '💚', rarity: 'common', stars: 2, effect: '+微量灵气', location: '各地山野', price: 20 },
  { id: 'tianlingzhi', name: '天灵芝', emoji: '🍄', rarity: 'rare', stars: 4, effect: '炼制金丹丹药', location: '天南地区', price: 800 },
];

// ===== 门派数据 =====
export const SECTS: Sect[] = [
  { id: 'huangfenggu', name: '黄枫谷', emoji: '🗡️', position: '天南大宗', skill: '青元剑诀', feature: '剑修圣地，韩立入门之宗' },
  { id: 'yanyuezong', name: '掩月宗', emoji: '🌙', position: '天南顶级', skill: '素女轮回功', feature: '以女修为主，媚术精绝' },
  { id: 'luoyunzong', name: '落云宗', emoji: '☁️', position: '天南大宗', skill: '落云心法', feature: '云系功法，仙气缥缈' },
  { id: 'nixingmeng', name: '逆星盟', emoji: '⭐', position: '乱星海势力', skill: '各流派兼修', feature: '散修联合，资源争夺' },
  { id: 'yinyuelangzu', name: '银月狼族', emoji: '🐺', position: '妖族势力', skill: '妖族传承', feature: '银月血脉，妖修之路' },
  { id: 'yechazu', name: '夜叉族', emoji: '👻', position: '外族势力', skill: '夜叉神通', feature: '灵界异族，敌对势力' },
];

// ===== 技能数据 =====
export const SKILLS: Skill[] = [
  { id: 'qingyuanjian', name: '青元剑诀', emoji: '⚔️', type: 'attack', element: '金', description: '黄枫谷镇派剑法，以灵力化剑', qiCost: 10, realmRequired: 1, damage: 50 },
  { id: 'fanshengzhenmogong', name: '梵圣真魔功', emoji: '👹', type: 'attack', element: '暗', description: '亦正亦邪的顶级功法', qiCost: 30, realmRequired: 3, damage: 200 },
  { id: 'dawuxingjue', name: '大五行决', emoji: '☯️', type: 'attack', element: '五行', description: '融合五行之力的究极功法', qiCost: 100, realmRequired: 5, damage: 800 },
  { id: 'jingangshu', name: '金刚术', emoji: '🛡️', type: 'defense', element: '土', description: '防御护体之术', qiCost: 8, realmRequired: 1, healing: 30 },
  { id: 'yinni', name: '隐匿遁术', emoji: '👻', type: 'support', element: '风', description: '隐藏身形气息', qiCost: 5, realmRequired: 1 },
  { id: 'suodicun', name: '缩地成寸', emoji: '💨', type: 'support', element: '空间', description: '空间挪移之术', qiCost: 20, realmRequired: 3 },
  { id: 'feijian', name: '飞剑斩杀', emoji: '🗡️', type: 'attack', element: '金', description: '御剑飞行，以剑杀敌', qiCost: 15, realmRequired: 2, damage: 100 },
  { id: 'jianzhen', name: '剑阵合击', emoji: '⚡', type: 'attack', element: '金', description: '108口飞剑组成的毁灭剑阵', qiCost: 200, realmRequired: 6, damage: 2000 },
  { id: 'xuanbingdun', name: '玄冰护盾', emoji: '❄️', type: 'defense', element: '水', description: '以乾蓝冰焰化为冰盾', qiCost: 25, realmRequired: 3, healing: 100 },
  { id: 'tonglingzhi', name: '通灵之术', emoji: '🔮', type: 'support', element: '灵', description: '探查灵脉灵药', qiCost: 3, realmRequired: 1 },
];

// ===== 任务数据 =====
export const QUESTS: Quest[] = [
  { id: 'q1', title: '修炼入门', description: '进行10次修炼', type: 'main', realmRequired: 1, rewards: { qi: 50, stones: 100 }, target: 10, emoji: '📖' },
  { id: 'q2', title: '灵药初识', description: '收集3种灵药', type: 'main', realmRequired: 1, rewards: { qi: 100, stones: 200 }, target: 3, emoji: '🌿' },
  { id: 'q3', title: '法宝入手', description: '获得第一件法宝', type: 'main', realmRequired: 1, rewards: { qi: 200, stones: 500 }, target: 1, emoji: '⚔️' },
  { id: 'q4', title: '筑基之路', description: '突破到筑基期', type: 'main', realmRequired: 1, rewards: { qi: 500, stones: 1000, title: '黄枫谷弟子' }, target: 1, emoji: '⚡' },
  { id: 'q5', title: '金丹大成', description: '突破到金丹期', type: 'main', realmRequired: 2, rewards: { qi: 2000, stones: 5000 }, target: 1, emoji: '💎' },
  { id: 'q6', title: '日常修炼', description: '进行5次修炼', type: 'daily', realmRequired: 1, rewards: { qi: 20, stones: 50 }, target: 5, emoji: '🧘' },
  { id: 'q7', title: '灵药采集', description: '收集2种灵药', type: 'daily', realmRequired: 1, rewards: { qi: 30, stones: 80 }, target: 2, emoji: '🌱' },
  { id: 'q8', title: '秘境探索', description: '探索血色禁地', type: 'side', realmRequired: 1, rewards: { qi: 300, stones: 800, herb: '龙鳞果' }, target: 1, emoji: '🗺️' },
  { id: 'q9', title: '虚天殿探秘', description: '在虚天殿中获得至宝', type: 'side', realmRequired: 3, rewards: { qi: 1000, stones: 3000, treasure: '虚天鼎' }, target: 1, emoji: '🏰' },
  { id: 'q10', title: '炼丹大师', description: '炼制5次丹药', type: 'side', realmRequired: 2, rewards: { qi: 500, stones: 1500 }, target: 5, emoji: '🔥' },
];

// ===== 成就数据 =====
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: '境界之路', emoji: '⚡', description: '突破金丹期，踏入修仙新境界', target: 3, reward: '称号 + 1000灵石', category: 'realm' },
  { id: 'a2', name: '法宝收集', emoji: '⚔️', description: '集齐10件法宝', target: 10, reward: '专属光环', category: 'treasure' },
  { id: 'a3', name: '灵药图鉴', emoji: '🌿', description: '鉴定全部灵药', target: 10, reward: '炼丹经验+20%', category: 'herb' },
  { id: 'a4', name: '副本征服', emoji: '🗺️', description: '通关血色禁地与虚天殿', target: 7, reward: '稀有材料箱', category: 'dungeon' },
  { id: 'a5', name: '仙缘社交', emoji: '💕', description: '结交50位仙友', target: 50, reward: '羁绊技能', category: 'social' },
  { id: 'a6', name: '传奇故事', emoji: '📜', description: '完成全部十卷剧情', target: 10, reward: '称号"大道无尽"', category: 'story' },
  { id: 'a7', name: '炼丹入门', emoji: '🔥', description: '炼制10次丹药', target: 10, reward: '500灵石', category: 'alchemy' },
  { id: 'a8', name: '灵石富翁', emoji: '💎', description: '累积10万灵石', target: 100000, reward: '称号"灵石大亨"', category: 'wealth' },
];

// ===== 称号数据 =====
export const TITLES: Title[] = [
  { id: 't1', name: '山村少年', condition: '开始游戏', bonus: '全属性+5%', realmRequired: 0 },
  { id: 't2', name: '黄枫谷弟子', condition: '入门黄枫谷', bonus: '剑系伤害+10%', realmRequired: 1 },
  { id: 't3', name: '血色猎人', condition: '首通血色禁地', bonus: '灵药收获+20%', realmRequired: 1 },
  { id: 't4', name: '虚天之主', condition: '获得虚天鼎', bonus: '冰系防御+30%', realmRequired: 3 },
  { id: 't5', name: '飞升者', condition: '飞升灵界', bonus: '全属性+25%', realmRequired: 5 },
  { id: 't6', name: '大道无尽', condition: '完成全部十卷', bonus: '全属性+50%', realmRequired: 9 },
];

// ===== 经典语录 =====
export const QUOTES = [
  { text: '"修仙修仙，若是没了那颗向道之心，即使修为再高，也不过是一具行尸走肉。"', author: '— 韩立' },
  { text: '"修仙界弱肉强食，只有活着，才是最大的道理。"', author: '— 墨大夫' },
  { text: '"天道酬勤，但更要天命所归。掌天瓶在手，我不信命。"', author: '— 韩立（灵界篇）' },
  { text: '"飞升之路，万中无一。向某不才，愿为天下修士试一试。"', author: '— 向之礼' },
  { text: '"轮回尽头，你我终会相见。"', author: '— 南宫婉' },
];

// ===== 故事线数据 =====
export const STORY_VOLUMES = [
  { vol: 1, name: '山村少年', desc: '韩立被墨大夫收徒，修炼长春功，踏入修仙之门。', milestone: '凡人 → 炼气期', difficulty: 1 },
  { vol: 2, name: '黄枫谷', desc: '入门黄枫谷，结识厉飞雨，正式踏上修仙之路。', milestone: '炼气期 → 筑基期', difficulty: 2 },
  { vol: 3, name: '血色禁地', desc: '十年一开的禁地冒险，获得掌天瓶，命运由此改变。', milestone: '筑基期 · 获掌天瓶', difficulty: 3 },
  { vol: 4, name: '天南风云', desc: '越京风云，燕家堡夺宝，逐步在修仙界站稳脚跟。', milestone: '筑基期 → 金丹期', difficulty: 3 },
  { vol: 5, name: '乱星海', desc: '乱星海崛起，击杀妖兽，成就一方强者。', milestone: '金丹期 → 元婴期', difficulty: 4 },
  { vol: 6, name: '虚天殿', desc: '虚天殿夺宝，获得虚天鼎，与呼言老道亦敌亦友。', milestone: '元婴期 · 获虚天鼎', difficulty: 4 },
  { vol: 7, name: '昆吾山', desc: '远古遗迹群修夺宝，实力再次飞跃。', milestone: '元婴期 → 化神期', difficulty: 5 },
  { vol: 8, name: '飞升灵界', desc: '踏入灵界新世界，开始全新的修仙征程。', milestone: '化神期 → 炼虚期', difficulty: 5 },
  { vol: 9, name: '灵界终章', desc: '人族存亡之战，合体期巅峰强者。', milestone: '炼虚期 → 合体期', difficulty: 5 },
  { vol: 10, name: '仙界篇', desc: '飞升仙界，大道无尽，凡人终成传说。', milestone: '大乘期 → 渡劫期', difficulty: 5 },
];

// ===== 五行数据 =====
export const ELEMENTS = [
  { name: '金系', emoji: '⚔️', desc: '锐金庚金 · 攻击强化 · 飞剑伤害', color: '#ffd700' },
  { name: '木系', emoji: '🌿', desc: '青木灵木 · 生命恢复 · 木系功法', color: '#2ecc71' },
  { name: '水系', emoji: '💧', desc: '寒水玄水 · 辅助增益 · 冰系攻击', color: '#3498db' },
  { name: '火系', emoji: '🔥', desc: '离火真火 · 爆发输出 · 焚化技能', color: '#e74c3c' },
  { name: '土系', emoji: '🏔️', desc: '厚土戊土 · 防御强化 · 土遁之术', color: '#b8860b' },
];

// ===== NPC聊天回复 =====
export const CHAT_REPLIES: Record<string, string[]> = {
  '南宫婉': [
    '韩兄所言极是，修仙路上还需谨慎行事。',
    '此地灵气浓郁，正适合修炼。',
    '听闻前方有上古遗迹，可要一探？',
    '韩兄的青元剑诀又精进了呢！',
    '修仙修仙，贵在持之以恒。',
    '轮回尽头，你我终会相见。🌸',
    '这株灵药年份不浅，正好炼丹所用。',
    '韩兄，来日方长，后会有期。',
  ],
  '紫灵仙子': [
    '韩兄好久不见，修为更进一步了。',
    '听说虚天殿有古宝现世，可有兴趣？',
    '修仙路上多凶险，韩兄保重。',
    '此处风景甚美，且驻足一观。',
  ],
  '银月': [
    '主人，前方有妖兽出没。',
    '银月感应到此地有灵脉波动。',
    '嗷呜～银月饿了……',
    '主人修炼辛苦了，休息一下吧。',
  ],
};

// ===== 拍卖行初始数据 =====
export const INITIAL_AUCTION_ITEMS: AuctionItem[] = [
  { id: 'au1', name: '银角芝 ×3', currentPrice: 500, timeLeft: 8130, bids: 12, hot: false, type: 'herb' },
  { id: 'au2', name: '青竹蜂云剑(残)', currentPrice: 8000, timeLeft: 312, bids: 45, hot: true, type: 'treasure' },
  { id: 'au3', name: '筑基丹配方', currentPrice: 2500, timeLeft: 20520, bids: 8, hot: false, type: 'material' },
  { id: 'au4', name: '九曲灵参(百年)', currentPrice: 12000, timeLeft: 4800, bids: 23, hot: false, type: 'herb' },
  { id: 'au5', name: '龙鳞果(千年)', currentPrice: 25000, timeLeft: 11445, bids: 67, hot: true, type: 'herb' },
  { id: 'au6', name: '补天丹 ×1', currentPrice: 50000, timeLeft: 1938, bids: 102, hot: true, type: 'herb' },
];
