// ========== 仙缘大陆 - 游戏状态管理 (Zustand + localStorage) ==========
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { REALMS, HERBS, TREASURES, SKILLS, QUESTS, REGIONS, type ChatMessage, type AuctionItem, INITIAL_AUCTION_ITEMS } from '../data/gameData';

export interface PlayerState {
  playerName: string;
  currentRealm: number;
  qi: number;
  maxQi: number;
  spiritStones: number;
  totalCultivations: number;
  totalAlchemy: number;
  ownedHerbs: Record<string, number>;
  ownedTreasures: string[];
  equippedTreasure: string | null;
  learnedSkills: string[];
  unlockedTitles: string[];
  activeTitle: string | null;
  questProgress: Record<string, number>;
  completedQuests: string[];
  achievementProgress: Record<string, number>;
  completedAchievements: string[];
  chatHistory: Record<string, ChatMessage[]>;
  friends: string[];
  auctionItems: AuctionItem[];
  currentVolume: number;
  exploredRegions: string[];
  alchemyLevel: number;
  createdAt: number;
  lastLogin: number;
}

export interface GameActions {
  cultivate: () => { qi: number; bonus: string } | null;
  breakthrough: () => { success: boolean; message: string };
  collectHerb: (herbId: string) => boolean;
  useHerb: (herbId: string) => { effect: string; value: number } | null;
  acquireTreasure: (treasureId: string) => boolean;
  equipTreasure: (treasureId: string) => void;
  learnSkill: (skillId: string) => boolean;
  updateQuestProgress: (questId: string, amount?: number) => void;
  completeQuest: (questId: string) => { rewards: string } | null;
  checkAchievements: () => string[];
  earnStones: (amount: number) => void;
  spendStones: (amount: number) => boolean;
  sendMessage: (friendName: string, text: string) => void;
  receiveMessage: (friendName: string, text: string) => void;
  addFriend: (name: string) => void;
  bidAuction: (itemId: string, amount: number) => boolean;
  advanceStory: () => boolean;
  exploreRegion: (regionId: string) => { rewards: string; event: string } | null;
  performAlchemy: () => { success: boolean; result: string };
  unlockTitle: (titleId: string) => void;
  setActiveTitle: (titleId: string | null) => void;
  resetGame: () => void;
  setPlayerName: (name: string) => void;
}

type GameStore = PlayerState & GameActions;

const CHAR_EMOJIS: Record<string, string> = {
  '南宫婉': '🌙', '紫灵仙子': '✨', '银月': '🐺', '墨大夫': '🧙', '向之礼': '🌟',
};

const initialState: PlayerState = {
  playerName: '韩立',
  currentRealm: 1,
  qi: 0,
  maxQi: 100,
  spiritStones: 1000,
  totalCultivations: 0,
  totalAlchemy: 0,
  ownedHerbs: {},
  ownedTreasures: [],
  equippedTreasure: null,
  learnedSkills: ['qingyuanjian'],
  unlockedTitles: ['t1'],
  activeTitle: 't1',
  questProgress: {},
  completedQuests: [],
  achievementProgress: {},
  completedAchievements: [],
  chatHistory: {},
  friends: ['南宫婉'],
  auctionItems: INITIAL_AUCTION_ITEMS,
  currentVolume: 1,
  exploredRegions: ['tiannan'],
  alchemyLevel: 1,
  createdAt: Date.now(),
  lastLogin: Date.now(),
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      cultivate: () => {
        const state = get();
        const realm = REALMS[state.currentRealm - 1];
        if (!realm) return null;
        let baseQi = 5 + state.currentRealm * 3;
        if (state.equippedTreasure) {
          const t = TREASURES.find(t => t.id === state.equippedTreasure);
          if (t) baseQi += Math.floor(t.attack / 100 + t.defense / 100);
        }
        const bonus = Math.random() > 0.85 ? '灵气涌动！双倍获取！' : '';
        if (bonus) baseQi *= 2;
        const stoneBonus = Math.floor(Math.random() * (state.currentRealm * 5));
        set(s => ({
          qi: Math.min(s.qi + baseQi, s.maxQi),
          spiritStones: s.spiritStones + stoneBonus,
          totalCultivations: s.totalCultivations + 1,
        }));
        get().updateQuestProgress('q1', 1);
        get().updateQuestProgress('q6', 1);
        return { qi: baseQi, bonus };
      },

      breakthrough: () => {
        const state = get();
        if (state.currentRealm >= 9) return { success: false, message: '已达最高境界！大道无尽！' };
        const realm = REALMS[state.currentRealm - 1];
        if (state.qi < realm.qiNeeded) return { success: false, message: `灵气不足！需要 ${realm.qiNeeded}，当前 ${state.qi}` };
        let chance = realm.breakthroughChance;
        if (state.ownedHerbs['butiantan'] && state.ownedHerbs['butiantan'] > 0) chance = Math.min(chance + 0.15, 0.95);
        const success = Math.random() < chance;
        if (success) {
          const nr = state.currentRealm + 1;
          const nrd = REALMS[nr - 1];
          set(s => ({ currentRealm: nr, qi: 0, maxQi: nrd.qiNeeded, spiritStones: s.spiritStones + nr * 500 }));
          if (nr === 2) get().updateQuestProgress('q4', 1);
          if (nr === 3) get().updateQuestProgress('q5', 1);
          return { success: true, message: `突破成功！晋升${nrd.name}！天地灵气涌动！` };
        }
        set(s => ({ qi: Math.floor(s.qi * 0.7) }));
        return { success: false, message: '突破失败！灵气反噬，损失30%灵气。' };
      },

      collectHerb: (herbId) => {
        const herb = HERBS.find(h => h.id === herbId);
        if (!herb || get().spiritStones < herb.price) return false;
        set(s => ({
          ownedHerbs: { ...s.ownedHerbs, [herbId]: (s.ownedHerbs[herbId] || 0) + 1 },
          spiritStones: s.spiritStones - herb.price,
        }));
        get().updateQuestProgress('q2', 1);
        get().updateQuestProgress('q7', 1);
        return true;
      },

      useHerb: (herbId) => {
        const state = get();
        if (!state.ownedHerbs[herbId] || state.ownedHerbs[herbId] <= 0) return null;
        const herb = HERBS.find(h => h.id === herbId);
        if (!herb) return null;
        let qiGain = 0;
        switch (herb.rarity) {
          case 'common': qiGain = 10 + Math.floor(Math.random() * 20); break;
          case 'rare': qiGain = 50 + Math.floor(Math.random() * 100); break;
          case 'legendary': qiGain = 200 + Math.floor(Math.random() * 500); break;
        }
        if (herbId === 'longlinguuo') qiGain = 500;
        if (herbId === 'jiuqulingcan') qiGain = 400;
        set(s => ({
          ownedHerbs: { ...s.ownedHerbs, [herbId]: s.ownedHerbs[herbId] - 1 },
          qi: Math.min(s.qi + qiGain, s.maxQi),
        }));
        return { effect: herb.effect, value: qiGain };
      },

      acquireTreasure: (treasureId) => {
        const state = get();
        const treasure = TREASURES.find(t => t.id === treasureId);
        if (!treasure || state.ownedTreasures.includes(treasureId) || state.spiritStones < treasure.cost) return false;
        set(s => ({
          ownedTreasures: [...s.ownedTreasures, treasureId],
          spiritStones: s.spiritStones - treasure.cost,
        }));
        get().updateQuestProgress('q3', 1);
        if (treasureId === 'xutianding') get().updateQuestProgress('q9', 1);
        return true;
      },

      equipTreasure: (tid) => set({ equippedTreasure: tid }),

      learnSkill: (skillId) => {
        const state = get();
        const skill = SKILLS.find(s => s.id === skillId);
        if (!skill || state.learnedSkills.includes(skillId) || state.currentRealm < skill.realmRequired) return false;
        const cost = skill.qiCost * 10;
        if (state.spiritStones < cost) return false;
        set(s => ({ learnedSkills: [...s.learnedSkills, skillId], spiritStones: s.spiritStones - cost }));
        return true;
      },

      updateQuestProgress: (questId, amount = 1) => {
        set(s => ({ questProgress: { ...s.questProgress, [questId]: (s.questProgress[questId] || 0) + amount } }));
      },

      completeQuest: (questId) => {
        const state = get();
        if (state.completedQuests.includes(questId)) return null;
        const quest = QUESTS.find(q => q.id === questId);
        if (!quest) return null;
        if ((state.questProgress[questId] || 0) < quest.target) return null;
        const rewards: string[] = [];
        let qiG = 0, stG = 0;
        if (quest.rewards.qi) { qiG = quest.rewards.qi; rewards.push(`灵气+${qiG}`); }
        if (quest.rewards.stones) { stG = quest.rewards.stones; rewards.push(`灵石+${stG}`); }
        set(s => ({
          qi: Math.min(s.qi + qiG, s.maxQi),
          spiritStones: s.spiritStones + stG,
          completedQuests: [...s.completedQuests, questId],
        }));
        return { rewards: rewards.join(', ') };
      },

      checkAchievements: () => {
        const state = get();
        const na: string[] = [];
        if (!state.completedAchievements.includes('a1') && state.currentRealm >= 3) {
          set(s => ({ completedAchievements: [...s.completedAchievements, 'a1'], spiritStones: s.spiritStones + 1000 }));
          na.push('境界之路');
        }
        if (!state.completedAchievements.includes('a2') && state.ownedTreasures.length >= 5) {
          set(s => ({ completedAchievements: [...s.completedAchievements, 'a2'] }));
          na.push('法宝收集');
        }
        if (!state.completedAchievements.includes('a8') && state.spiritStones >= 100000) {
          set(s => ({ completedAchievements: [...s.completedAchievements, 'a8'] }));
          na.push('灵石富翁');
        }
        return na;
      },

      earnStones: (amt) => set(s => ({ spiritStones: s.spiritStones + amt })),
      spendStones: (amt) => { if (get().spiritStones < amt) return false; set(s => ({ spiritStones: s.spiritStones - amt })); return true; },

      sendMessage: (fn, text) => {
        const msg: ChatMessage = { id: Date.now().toString(), sender: get().playerName, avatar: '⚔️', text, self: true, timestamp: Date.now() };
        set(s => ({ chatHistory: { ...s.chatHistory, [fn]: [...(s.chatHistory[fn] || []), msg] } }));
      },

      receiveMessage: (fn, text) => {
        const avatar = CHAR_EMOJIS[fn] || '🌙';
        const msg: ChatMessage = { id: (Date.now() + 1).toString(), sender: fn, avatar, text, self: false, timestamp: Date.now() };
        set(s => ({ chatHistory: { ...s.chatHistory, [fn]: [...(s.chatHistory[fn] || []), msg] } }));
      },

      addFriend: (name) => set(s => ({ friends: s.friends.includes(name) ? s.friends : [...s.friends, name] })),

      bidAuction: (itemId, amount) => {
        if (get().spiritStones < amount) return false;
        set(s => ({
          spiritStones: s.spiritStones - amount,
          auctionItems: s.auctionItems.map(i => i.id === itemId ? { ...i, currentPrice: amount, bids: i.bids + 1 } : i),
        }));
        return true;
      },

      advanceStory: () => {
        const s = get();
        if (s.currentVolume >= 10 || s.currentRealm < s.currentVolume) return false;
        set(st => ({ currentVolume: st.currentVolume + 1, spiritStones: st.spiritStones + st.currentVolume * 200 }));
        return true;
      },

      exploreRegion: (regionId) => {
        const state = get();
        const region = REGIONS.find(r => r.id === regionId);
        if (region && state.currentRealm < region.minRealm) return null;
        const events = ['发现了一株灵药！', '击退了一只妖兽！', '找到了一处灵脉！', '遇到散修前辈。', '发现古修士洞府！'];
        const event = events[Math.floor(Math.random() * events.length)];
        const sg = Math.floor(Math.random() * 200 + 50) * state.currentRealm;
        const qg = Math.floor(Math.random() * 30 + 10) * state.currentRealm;
        set(s => ({
          spiritStones: s.spiritStones + sg, qi: Math.min(s.qi + qg, s.maxQi),
          exploredRegions: s.exploredRegions.includes(regionId) ? s.exploredRegions : [...s.exploredRegions, regionId],
        }));
        return { rewards: `灵石+${sg}, 灵气+${qg}`, event };
      },

      performAlchemy: () => {
        const state = get();
        const cost = 50 * state.alchemyLevel;
        if (state.spiritStones < cost) return { success: false, result: '灵石不足！' };
        const success = Math.random() < (0.6 + state.alchemyLevel * 0.02);
        if (success) {
          const qg = 30 * state.alchemyLevel + Math.floor(Math.random() * 50);
          set(s => ({
            spiritStones: s.spiritStones - cost, qi: Math.min(s.qi + qg, s.maxQi),
            totalAlchemy: s.totalAlchemy + 1,
            alchemyLevel: s.totalAlchemy % 5 === 4 ? s.alchemyLevel + 1 : s.alchemyLevel,
          }));
          get().updateQuestProgress('q10', 1);
          return { success: true, result: `炼丹成功！灵气+${qg}` };
        }
        set(s => ({ spiritStones: s.spiritStones - Math.floor(cost / 2), totalAlchemy: s.totalAlchemy + 1 }));
        return { success: false, result: '炼丹失败！药材炸炉。' };
      },

      unlockTitle: (tid) => set(s => ({ unlockedTitles: s.unlockedTitles.includes(tid) ? s.unlockedTitles : [...s.unlockedTitles, tid] })),
      setActiveTitle: (tid) => set({ activeTitle: tid }),
      resetGame: () => set({ ...initialState, createdAt: Date.now(), lastLogin: Date.now() }),
      setPlayerName: (name) => set({ playerName: name }),
    }),
    { name: 'xianyuan-game-state', version: 1 }
  )
);

// ===== Toast =====
interface ToastState {
  toasts: Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Date.now();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3000);
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));
