import { useState, useEffect, useRef } from 'react';
import { useGameStore, useToastStore } from './hooks/useGameStore';
import {
  REALMS, CHARACTERS, TREASURES, REGIONS, HERBS, SECTS,
  SKILLS, QUESTS, ACHIEVEMENTS, TITLES, QUOTES,
  STORY_VOLUMES, ELEMENTS, CHAT_REPLIES,
} from './data/gameData';
import './App.css';

// ========== Toast 通知组件 ==========
function Toasts() {
  const toasts = useToastStore(s => s.toasts);
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
      ))}
    </div>
  );
}

// ========== 导航栏 ==========
function Navbar({ activeSection, onNav }: { activeSection: string; onNav: (s: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentRealm, spiritStones, qi, maxQi } = useGameStore();
  const realmName = REALMS[currentRealm - 1]?.name || '炼气期';

  const links = [
    { id: 'hero', label: '首页' }, { id: 'cultivation', label: '修炼' },
    { id: 'world', label: '世界' }, { id: 'characters', label: '角色' },
    { id: 'treasures', label: '法宝' }, { id: 'herbs', label: '灵药' },
    { id: 'quests', label: '任务' }, { id: 'auction', label: '拍卖' },
    { id: 'achievements', label: '成就' }, { id: 'social', label: '仙友' },
    { id: 'minigame', label: '挑战' },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => onNav('hero')}>⚔️ 凡人修仙传</div>
        <div className="nav-status">
          <span className="nav-realm">{realmName}</span>
          <span className="nav-stones">💎 {spiritStones.toLocaleString()}</span>
          <span className="nav-qi">⚡ {qi}/{maxQi}</span>
        </div>
        <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
        <ul className={`nav-links${mobileOpen ? ' open' : ''}`}>
          {links.map(l => (
            <li key={l.id}>
              <a href={`#${l.id}`}
                className={activeSection === l.id ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); onNav(l.id); setMobileOpen(false); }}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// ========== Hero 粒子Canvas ==========
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let animId: number;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5, speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 2 + 1, dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5, alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '255,215,0' : '155,89,182',
    }));

    let meteors: Array<{ x: number; y: number; len: number; speed: number; alpha: number }> = [];

    const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
      grad.addColorStop(0, 'rgba(20, 10, 40, 0.3)');
      grad.addColorStop(1, 'rgba(10, 10, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const time = Date.now() * 0.001;

      // Stars
      stars.forEach(s => {
        const a = (Math.sin(time * s.speed * 10 + s.phase) + 1) / 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a * 0.8})`;
        ctx.fill();
      });

      // Particles
      const mouse = mouseRef.current;
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        const interact = dist < 150 ? (150 - dist) / 150 : 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + interact * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha + interact * 0.3})`;
        ctx.fill();
        if (interact > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + interact * 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color},${interact * 0.15})`;
          ctx.fill();
        }
      });

      // Meteors
      if (meteors.length < 3 && Math.random() < 0.005) {
        meteors.push({ x: Math.random() * w * 0.8, y: -10, len: Math.random() * 80 + 40, speed: Math.random() * 4 + 3, alpha: 1 });
      }
      meteors = meteors.filter(m => m.alpha > 0);
      meteors.forEach(m => {
        m.x += m.speed * 2; m.y += m.speed; m.alpha -= 0.01;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.len, m.y - m.len * 0.5);
        const g = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y - m.len * 0.5);
        g.addColorStop(0, `rgba(255,215,0,${m.alpha})`);
        g.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
      });

      // Tai Chi
      const tSize = Math.min(w, h) * 0.08;
      ctx.save();
      ctx.translate(w / 2, h * 0.75);
      ctx.rotate(time * 0.3);
      ctx.globalAlpha = 0.06;
      ctx.beginPath(); ctx.arc(0, 0, tSize, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700'; ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(draw);
    };
    draw();

    const handleMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    canvas.addEventListener('mousemove', handleMouse);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" />;
}

// ========== Hero区域 ==========
function HeroSection({ onNav }: { onNav: (s: string) => void }) {
  const { playerName, currentRealm, spiritStones } = useGameStore();
  const realmName = REALMS[currentRealm - 1]?.name || '炼气期';

  return (
    <section id="hero" className="hero-section">
      <HeroCanvas />
      <div className="hero-content">
        <h1 className="hero-title">凡人修仙传</h1>
        <p className="hero-sub">仙 缘 大 陆 · 逆 天 改 命</p>
        <div className="hero-player-info">
          <span>⚔️ {playerName}</span>
          <span>🔮 {realmName}</span>
          <span>💎 {spiritStones.toLocaleString()} 灵石</span>
        </div>
        <button className="hero-btn" onClick={() => onNav('cultivation')}>
          踏入修仙之路
        </button>
      </div>
    </section>
  );
}

// ========== 修炼系统 ==========
function CultivationSection() {
  const {
    currentRealm, qi, maxQi, spiritStones, totalCultivations,
    cultivate, breakthrough, equippedTreasure, learnedSkills,
    playerName, activeTitle, ownedTreasures, equipTreasure,
  } = useGameStore();
  const addToast = useToastStore(s => s.addToast);
  const [cultivating, setCultivating] = useState(false);
  const [breakthroughAnim, setBreakthroughAnim] = useState(false);
  const [lastResult, setLastResult] = useState('');

  const realm = REALMS[currentRealm - 1];
  const nextRealm = currentRealm < 9 ? REALMS[currentRealm] : null;
  const qiPercent = Math.min((qi / maxQi) * 100, 100);
  const title = TITLES.find(t => t.id === activeTitle);

  const handleCultivate = () => {
    setCultivating(true);
    setTimeout(() => {
      const result = cultivate();
      if (result) {
        setLastResult(`灵气 +${result.qi} ${result.bonus}`);
        if (result.bonus) addToast(result.bonus, 'success');
      }
      setCultivating(false);
    }, 600);
  };

  const handleBreakthrough = () => {
    setBreakthroughAnim(true);
    setTimeout(() => {
      const result = breakthrough();
      setLastResult(result.message);
      addToast(result.message, result.success ? 'success' : 'error');
      setBreakthroughAnim(false);
      if (result.success) {
        useGameStore.getState().checkAchievements();
      }
    }, 1500);
  };

  return (
    <section id="cultivation" className="section">
      <div className="container">
        <h2 className="section-title">🧘 修炼之道</h2>
        <p className="section-sub">引气入体 · 逆天改命</p>

        <div className="cultivation-layout">
          {/* 角色面板 */}
          <div className="cultivation-panel card">
            <div className="cult-avatar">⚔️</div>
            <h3 className="cult-name">{playerName}</h3>
            {title && <div className="cult-title-badge">{title.name}</div>}
            <div className="cult-realm">{realm.name} · {realm.chineseNum}层</div>
            <div className="cult-lifespan">寿命: {realm.lifespan}</div>

            <div className="cult-qi-section">
              <div className="cult-qi-label">
                <span>灵气</span>
                <span>{qi} / {maxQi}</span>
              </div>
              <div className="progress-bar cult-qi-bar">
                <div className="progress-fill" style={{ width: `${qiPercent}%` }} />
              </div>
            </div>

            <div className="cult-stats">
              <div className="cult-stat">
                <span className="cult-stat-label">💎 灵石</span>
                <span className="cult-stat-value">{spiritStones.toLocaleString()}</span>
              </div>
              <div className="cult-stat">
                <span className="cult-stat-label">🧘 修炼次数</span>
                <span className="cult-stat-value">{totalCultivations}</span>
              </div>
              <div className="cult-stat">
                <span className="cult-stat-label">⚔️ 装备法宝</span>
                <span className="cult-stat-value">{equippedTreasure ? TREASURES.find(t => t.id === equippedTreasure)?.name : '无'}</span>
              </div>
              <div className="cult-stat">
                <span className="cult-stat-label">📖 功法</span>
                <span className="cult-stat-value">{learnedSkills.length}种</span>
              </div>
            </div>

            {lastResult && <div className="cult-result">{lastResult}</div>}
          </div>

          {/* 修炼操作 */}
          <div className="cultivation-actions">
            <div className={`cult-action-card card ${cultivating ? 'cultivating' : ''}`}>
              <h4>🧘 打坐修炼</h4>
              <p>吸纳天地灵气，增强修为</p>
              <p className="cult-info">每次获得 {5 + currentRealm * 3} 灵气</p>
              <button className="btn btn-primary btn-lg" onClick={handleCultivate} disabled={cultivating}>
                {cultivating ? '修炼中...' : '开始修炼'}
              </button>
            </div>

            <div className={`cult-action-card card ${breakthroughAnim ? 'breakthrough-anim' : ''}`}>
              <h4>⚡ 境界突破</h4>
              {nextRealm ? (
                <>
                  <p>下一境界: <span className="gold-text">{nextRealm.name}</span></p>
                  <p className="cult-info">需要灵气: {realm.qiNeeded} | 成功率: {(realm.breakthroughChance * 100).toFixed(0)}%</p>
                  <div className="progress-bar" style={{ marginBottom: 12 }}>
                    <div className="progress-fill" style={{ width: `${qiPercent}%` }} />
                  </div>
                  <button
                    className={`btn btn-lg ${qi >= realm.qiNeeded ? 'btn-success' : 'btn-danger'}`}
                    onClick={handleBreakthrough}
                    disabled={breakthroughAnim || qi < realm.qiNeeded}
                  >
                    {breakthroughAnim ? '渡劫中...' : qi >= realm.qiNeeded ? '尝试突破' : '灵气不足'}
                  </button>
                </>
              ) : (
                <p className="gold-text">已达最高境界！大道无尽！</p>
              )}
            </div>

            {/* 技能列表 */}
            <div className="cult-action-card card">
              <h4>📖 已学功法</h4>
              <div className="skill-list">
                {learnedSkills.map(sid => {
                  const skill = SKILLS.find(s => s.id === sid);
                  if (!skill) return null;
                  return (
                    <div key={sid} className="skill-item">
                      <span className="skill-emoji">{skill.emoji}</span>
                      <div>
                        <div className="skill-name">{skill.name}</div>
                        <div className="skill-desc">{skill.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 装备法宝 */}
            {ownedTreasures.length > 0 && (
              <div className="cult-action-card card">
                <h4>🗡️ 切换法宝</h4>
                <div className="equip-list">
                  {ownedTreasures.map(tid => {
                    const t = TREASURES.find(tr => tr.id === tid);
                    if (!t) return null;
                    return (
                      <button
                        key={tid}
                        className={`btn btn-sm ${equippedTreasure === tid ? 'btn-primary' : ''}`}
                        onClick={() => equipTreasure(tid)}
                      >
                        {t.emoji} {t.name} {equippedTreasure === tid ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 境界总览 */}
        <h3 className="section-title" style={{ fontSize: '1.5rem', marginTop: 60 }}>⚡ 九层境界</h3>
        <div className="realm-grid">
          {REALMS.map(r => (
            <div key={r.id} className={`realm-card card ${currentRealm === r.id ? 'active-realm' : ''} ${currentRealm > r.id ? 'passed-realm' : ''}`}>
              <div className="realm-level">{r.chineseNum}</div>
              <h3>{r.name}</h3>
              <div className="realm-meta">{r.lifespan}</div>
              <div className="realm-feature">{r.feature}</div>
              {currentRealm === r.id && <div className="realm-current-badge">当前</div>}
              {currentRealm > r.id && <div className="realm-passed-badge">✓</div>}
            </div>
          ))}
        </div>

        {/* 五行功法 */}
        <h3 className="section-title" style={{ fontSize: '1.5rem', marginTop: 60 }}>☯️ 五行功法</h3>
        <div className="elements-wheel">
          {ELEMENTS.map(el => (
            <div key={el.name} className="element-card card">
              <span className="el-icon">{el.emoji}</span>
              <h4 style={{ color: el.color }}>{el.name}</h4>
              <div className="el-desc">{el.desc}</div>
            </div>
          ))}
        </div>

        {/* 技能学习 */}
        <h3 className="section-title" style={{ fontSize: '1.5rem', marginTop: 60 }}>📖 神通技能</h3>
        <div className="skill-grid">
          {SKILLS.map(skill => {
            const learned = learnedSkills.includes(skill.id);
            const canLearn = currentRealm >= skill.realmRequired && !learned;
            return (
              <div key={skill.id} className={`skill-card card ${learned ? 'learned' : ''} ${!canLearn && !learned ? 'locked' : ''}`}>
                <span className="skill-card-emoji">{skill.emoji}</span>
                <h4>{skill.name}</h4>
                <div className="skill-card-type">{skill.type === 'attack' ? '攻击' : skill.type === 'defense' ? '防御' : '辅助'} · {skill.element}</div>
                <p>{skill.description}</p>
                {skill.damage && <div className="skill-card-stat">伤害: {skill.damage}</div>}
                {skill.healing && <div className="skill-card-stat">恢复: {skill.healing}</div>}
                <div className="skill-card-req">需要: {REALMS[skill.realmRequired - 1]?.name}</div>
                {learned ? (
                  <span className="tag tag-green">已学</span>
                ) : canLearn ? (
                  <button className="btn btn-sm btn-primary" onClick={() => {
                    if (useGameStore.getState().learnSkill(skill.id)) addToast(`学会${skill.name}！`, 'success');
                    else addToast('灵石不足！', 'error');
                  }}>
                    学习 ({skill.qiCost * 10}灵石)
                  </button>
                ) : (
                  <span className="tag">境界不足</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ========== 世界地图 ==========
function WorldSection() {
  const { currentRealm, exploredRegions, exploreRegion } = useGameStore();
  const addToast = useToastStore(s => s.addToast);

  const handleExplore = (regionId: string) => {
    const result = exploreRegion(regionId);
    if (result) {
      addToast(`${result.event} ${result.rewards}`, 'success');
    } else {
      addToast('境界不足，无法探索此区域！', 'error');
    }
  };

  return (
    <section id="world" className="section">
      <div className="container">
        <h2 className="section-title">🗺️ 仙缘大陆</h2>
        <p className="section-sub">灵气复苏 · 修仙问道 · 万族并立</p>

        <div className="map-container">
          {REGIONS.map(r => {
            const canExplore = currentRealm >= r.minRealm;
            const explored = exploredRegions.includes(r.id);
            return (
              <div key={r.id} className={`region-card card ${!canExplore ? 'locked-region' : ''}`}>
                <span className="region-emoji">{r.emoji}</span>
                <h3>{r.name}</h3>
                <p>{r.description}</p>
                <div className="region-footer">
                  <span className="tag">{r.tag}</span>
                  <span className="region-danger">{'⭐'.repeat(r.dangerLevel)}</span>
                </div>
                <div className="region-req">需要: {REALMS[r.minRealm - 1]?.name}</div>
                {explored && <div className="region-explored">已探索</div>}
                {canExplore && (
                  <button className="btn btn-sm btn-primary" style={{ marginTop: 8 }} onClick={() => handleExplore(r.id)}>
                    探索
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 门派 */}
        <h3 className="section-title" style={{ fontSize: '1.5rem', marginTop: 60 }}>🏛️ 修仙门派</h3>
        <p className="section-sub">六大势力 · 各据一方</p>
        <div className="sect-grid">
          {SECTS.map(s => (
            <div key={s.id} className="sect-card card">
              <h3>{s.emoji} {s.name}</h3>
              <div className="sect-info">
                <div><span className="sect-label">定位：</span>{s.position}</div>
                <div><span className="sect-label">镇派功法：</span>{s.skill}</div>
                <div><span className="sect-label">特色：</span>{s.feature}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== 角色系统 ==========
function CharactersSection() {
  const [activeChar, setActiveChar] = useState('hanli');
  const char = CHARACTERS.find(c => c.id === activeChar)!;

  return (
    <section id="characters" className="section">
      <div className="container">
        <h2 className="section-title">👥 核心角色</h2>
        <p className="section-sub">凡人之路 · 各有因缘</p>

        <div className="char-tabs">
          {CHARACTERS.map(c => (
            <button key={c.id}
              className={`btn ${activeChar === c.id ? 'btn-primary' : ''}`}
              onClick={() => setActiveChar(c.id)}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        <div className="char-profile card" key={activeChar}>
          <div className="char-avatar-lg">{char.emoji}</div>
          <div className="char-name">{char.name}</div>
          <div className="char-title-text">{char.title}</div>
          <div className="char-stats-grid">
            <div className="char-stat"><div className="char-stat-label">功法</div><div className="char-stat-value">{char.skills.join(' / ')}</div></div>
            <div className="char-stat"><div className="char-stat-label">特点</div><div className="char-stat-value">{char.traits}</div></div>
            <div className="char-stat"><div className="char-stat-label">{char.relationLabel}</div><div className="char-stat-value">{char.relation}</div></div>
            <div className="char-stat"><div className="char-stat-label">宗门</div><div className="char-stat-value">{char.sect}</div></div>
          </div>
          <p className="char-desc">{char.description}</p>
          {char.treasures && (
            <div className="char-treasures">
              {char.treasures.map(t => <span key={t} className="char-treasure-tag">{t}</span>)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ========== 法宝系统 ==========
function TreasuresSection() {
  const { ownedTreasures, equippedTreasure, acquireTreasure, equipTreasure, spiritStones } = useGameStore();
  const addToast = useToastStore(s => s.addToast);

  return (
    <section id="treasures" className="section">
      <div className="container">
        <h2 className="section-title">⚔️ 至宝法器</h2>
        <p className="section-sub">先天至宝 · 玄天之宝 · 逆天改命</p>

        <div className="treasure-grid">
          {TREASURES.map(t => {
            const owned = ownedTreasures.includes(t.id);
            const equipped = equippedTreasure === t.id;
            return (
              <div key={t.id} className={`treasure-card card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`}>
                <span className="treasure-icon">{t.emoji}</span>
                <h3>{t.name}</h3>
                <div className="treasure-grade">{t.grade}</div>
                <div className="treasure-stars">{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</div>
                <p className="treasure-desc">{t.description}</p>
                {t.attack > 0 && <div className="treasure-stat">攻击: +{t.attack}</div>}
                {t.defense > 0 && <div className="treasure-stat">防御: +{t.defense}</div>}
                <div className="treasure-stat">特效: {t.special}</div>
                {t.bond && <div className="treasure-bond">🔗 {t.bond}</div>}

                <div className="treasure-actions">
                  {owned ? (
                    <button
                      className={`btn btn-sm ${equipped ? 'btn-success' : 'btn-primary'}`}
                      onClick={() => equipTreasure(t.id)}
                    >
                      {equipped ? '已装备 ✓' : '装备'}
                    </button>
                  ) : (
                    <button
                      className={`btn btn-sm ${spiritStones >= t.cost ? 'btn-primary' : ''}`}
                      onClick={() => {
                        if (acquireTreasure(t.id)) addToast(`获得${t.name}！`, 'success');
                        else addToast('灵石不足！', 'error');
                      }}
                      disabled={spiritStones < t.cost}
                    >
                      购买 ({t.cost.toLocaleString()} 灵石)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 炼制流程 */}
        <h3 className="section-title" style={{ fontSize: '1.5rem', marginTop: 60 }}>🔧 法宝炼制流程</h3>
        <div className="forge-steps">
          {[
            { icon: '💎', title: '材料收集', desc: '灵材/矿石 · 妖丹 · 秘境采集' },
            { icon: '🔥', title: '真火锻造', desc: '炼器炉台 · 真火炼化' },
            { icon: '👻', title: '器灵注入', desc: '精血/神魂 · 器灵觉醒' },
            { icon: '✨', title: '法宝成型', desc: '法器→法宝→灵宝→至宝' },
          ].map((step, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="forge-step card">
                <span className="forge-step-icon">{step.icon}</span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
              {i < arr.length - 1 && <span className="forge-arrow">→</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== 灵药图鉴 & 炼丹 ==========
function HerbsSection() {
  const { ownedHerbs, collectHerb, useHerb, performAlchemy, alchemyLevel, totalAlchemy } = useGameStore();
  const addToast = useToastStore(s => s.addToast);
  const [filter, setFilter] = useState('all');

  const filteredHerbs = HERBS.filter(h => filter === 'all' || h.rarity === filter);

  return (
    <section id="herbs" className="section">
      <div className="container">
        <h2 className="section-title">🌿 灵药仙草图鉴</h2>
        <p className="section-sub">灵草奇花 · 各具功效</p>

        <div className="herb-filters">
          {['all', 'common', 'rare', 'legendary'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : ''}`}
              onClick={() => setFilter(f)}>
              {f === 'all' ? '全部' : f === 'common' ? '常见' : f === 'rare' ? '稀有' : '传说'}
            </button>
          ))}
        </div>

        <div className="herb-grid">
          {filteredHerbs.map(h => {
            const count = ownedHerbs[h.id] || 0;
            return (
              <div key={h.id} className="herb-card card">
                <span className="herb-emoji">{h.emoji}</span>
                <h4>{h.name}</h4>
                <div className="herb-stars">{'★'.repeat(h.stars)}{'☆'.repeat(5 - h.stars)}</div>
                <div className="herb-effect">{h.effect}</div>
                <div className="herb-location">📍 {h.location}</div>
                {count > 0 && <div className="herb-owned">拥有: {count}</div>}
                <div className="herb-actions">
                  <button className="btn btn-sm" onClick={() => {
                    if (collectHerb(h.id)) addToast(`获得${h.name}！`, 'success');
                    else addToast('灵石不足！', 'error');
                  }}>
                    购买 ({h.price}💎)
                  </button>
                  {count > 0 && (
                    <button className="btn btn-sm btn-success" onClick={() => {
                      const r = useHerb(h.id);
                      if (r) addToast(`使用${h.name}：灵气+${r.value}`, 'success');
                    }}>
                      使用
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 炼丹系统 */}
        <h3 className="section-title" style={{ fontSize: '1.5rem', marginTop: 60 }}>🔥 炼丹炉</h3>
        <div className="alchemy-panel card" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <div className="alchemy-icon">🔥</div>
          <h4>炼丹等级: {alchemyLevel}</h4>
          <p>总炼丹次数: {totalAlchemy}</p>
          <p>消耗: {50 * alchemyLevel} 灵石</p>
          <p>成功率: {((0.6 + alchemyLevel * 0.02) * 100).toFixed(0)}%</p>
          <button className="btn btn-primary btn-lg" style={{ marginTop: 16 }}
            onClick={() => {
              const r = performAlchemy();
              addToast(r.result, r.success ? 'success' : 'error');
            }}>
            开始炼丹
          </button>
        </div>
      </div>
    </section>
  );
}

// ========== 任务系统 ==========
function QuestsSection() {
  const { questProgress, completedQuests, completeQuest, currentRealm } = useGameStore();
  const addToast = useToastStore(s => s.addToast);
  const [tab, setTab] = useState<'main' | 'side' | 'daily'>('main');

  const quests = QUESTS.filter(q => q.type === tab);

  return (
    <section id="quests" className="section">
      <div className="container">
        <h2 className="section-title">📜 任务仙令</h2>
        <p className="section-sub">修仙路途 · 步步为营</p>

        <div className="quest-tabs">
          {(['main', 'side', 'daily'] as const).map(t => (
            <button key={t} className={`btn ${tab === t ? 'btn-primary' : ''}`}
              onClick={() => setTab(t)}>
              {t === 'main' ? '主线任务' : t === 'side' ? '支线任务' : '日常任务'}
            </button>
          ))}
        </div>

        <div className="quest-list">
          {quests.map(q => {
            const progress = questProgress[q.id] || 0;
            const completed = completedQuests.includes(q.id);
            const canComplete = progress >= q.target && !completed;
            const locked = currentRealm < q.realmRequired;

            return (
              <div key={q.id} className={`quest-card card ${completed ? 'quest-completed' : ''} ${locked ? 'locked' : ''}`}>
                <div className="quest-header">
                  <span className="quest-emoji">{q.emoji}</span>
                  <div>
                    <h4>{q.title}</h4>
                    <p>{q.description}</p>
                  </div>
                  {completed && <span className="tag tag-green">已完成</span>}
                </div>
                <div className="quest-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min((progress / q.target) * 100, 100)}%` }} />
                  </div>
                  <span className="quest-progress-text">{Math.min(progress, q.target)} / {q.target}</span>
                </div>
                <div className="quest-footer">
                  <span className="quest-rewards">奖励: {q.rewards.qi && `灵气+${q.rewards.qi}`} {q.rewards.stones && `灵石+${q.rewards.stones}`}</span>
                  {canComplete && (
                    <button className="btn btn-sm btn-success" onClick={() => {
                      const r = completeQuest(q.id);
                      if (r) addToast(`任务完成！${r.rewards}`, 'success');
                    }}>
                      领取奖励
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ========== 拍卖行 ==========
function AuctionSection() {
  const { auctionItems, spiritStones, bidAuction } = useGameStore();
  const addToast = useToastStore(s => s.addToast);
  const [timers, setTimers] = useState<Record<string, number>>({});

  useEffect(() => {
    const initial: Record<string, number> = {};
    auctionItems.forEach(i => { initial[i.id] = i.timeLeft; });
    setTimers(initial);

    const interval = setInterval(() => {
      setTimers(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => { if (next[k] > 0) next[k]--; });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section id="auction" className="section">
      <div className="container">
        <h2 className="section-title">💰 仙缘拍卖行</h2>
        <p className="section-sub">竞价夺宝 · 价高者得</p>

        <div className="auction-table-wrapper">
          <table className="auction-table">
            <thead>
              <tr>
                <th>物品名称</th>
                <th>当前价</th>
                <th>剩余时间</th>
                <th>竞拍次数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {auctionItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td className="auction-price">{item.currentPrice.toLocaleString()} 灵石</td>
                  <td>{formatTime(timers[item.id] || 0)}</td>
                  <td className={item.hot ? 'auction-hot' : ''}>{item.bids}次竞拍 {item.hot && '⚡'}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => {
                      const bid = item.currentPrice + Math.floor(item.currentPrice * 0.1) + 100;
                      if (bidAuction(item.id, bid)) addToast(`出价 ${bid} 灵石！`, 'info');
                      else addToast('灵石不足！', 'error');
                    }}>
                      加价
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="auction-balance">💎 灵石余额：{spiritStones.toLocaleString()}</div>
      </div>
    </section>
  );
}

// ========== 成就系统 ==========
function AchievementsSection() {
  const { completedAchievements, currentRealm, ownedTreasures, spiritStones, currentVolume, unlockedTitles, activeTitle, setActiveTitle } = useGameStore();

  const getProgress = (a: typeof ACHIEVEMENTS[0]) => {
    switch (a.category) {
      case 'realm': return Math.min(currentRealm, a.target);
      case 'treasure': return Math.min(ownedTreasures.length, a.target);
      case 'story': return Math.min(currentVolume, a.target);
      case 'wealth': return Math.min(spiritStones, a.target);
      default: return completedAchievements.includes(a.id) ? a.target : 0;
    }
  };

  return (
    <section id="achievements" className="section">
      <div className="container">
        <h2 className="section-title">🏆 修仙成就</h2>
        <p className="section-sub">大道无形 · 成就万千</p>

        <div className="achieve-grid">
          {ACHIEVEMENTS.map(a => {
            const progress = getProgress(a);
            const pct = Math.min((progress / a.target) * 100, 100);
            const completed = completedAchievements.includes(a.id);
            return (
              <div key={a.id} className={`achieve-card card ${completed ? 'achieve-done' : ''}`}>
                <span className="achieve-icon">{a.emoji}</span>
                <h4>{a.name}</h4>
                <div className="achieve-desc">{a.description}</div>
                <div className="progress-bar" style={{ margin: '8px 0' }}>
                  <div className={`progress-fill ${completed ? 'green' : ''}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="achieve-progress-text">
                  <span>{progress}/{a.target}</span>
                  <span>{pct.toFixed(0)}%</span>
                </div>
                <span className="tag tag-gold">奖励：{a.reward}</span>
              </div>
            );
          })}
        </div>

        {/* 称号系统 */}
        <h3 className="section-title" style={{ fontSize: '1.5rem', marginTop: 60 }}>🏅 称号体系</h3>
        <div className="title-grid">
          {TITLES.map(t => {
            const unlocked = unlockedTitles.includes(t.id);
            const isActive = activeTitle === t.id;
            return (
              <div key={t.id} className={`title-card card ${isActive ? 'title-active' : ''} ${!unlocked ? 'locked' : ''}`}
                onClick={() => unlocked && setActiveTitle(t.id)}>
                <div className="title-name">{t.name}</div>
                <div className="title-condition">{t.condition}</div>
                <div className="title-bonus">{t.bonus}</div>
                {isActive && <div className="title-active-badge">使用中</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ========== 社交系统 ==========
function SocialSection() {
  const { friends, chatHistory, sendMessage, receiveMessage, addFriend } = useGameStore();
  const [activeFriend, setActiveFriend] = useState('南宫婉');
  const [inputText, setInputText] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const messages = chatHistory[activeFriend] || [];

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(activeFriend, inputText.trim());
    setInputText('');

    // Auto reply
    setTimeout(() => {
      const replies = CHAT_REPLIES[activeFriend] || ['道友所言极是。', '修仙路上多保重。'];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      receiveMessage(activeFriend, reply);
    }, 800 + Math.random() * 1200);
  };

  return (
    <section id="social" className="section">
      <div className="container">
        <h2 className="section-title">💬 仙友传音</h2>
        <p className="section-sub">修仙路远 · 道友同行</p>

        <div className="social-layout">
          {/* 好友列表 */}
          <div className="friend-list card">
            <h4>仙友列表</h4>
            {friends.map(f => (
              <div key={f}
                className={`friend-item ${activeFriend === f ? 'active' : ''}`}
                onClick={() => setActiveFriend(f)}>
                <span className="friend-avatar">
                  {f === '南宫婉' ? '🌙' : f === '紫灵仙子' ? '✨' : f === '银月' ? '🐺' : '🌟'}
                </span>
                <span>{f}</span>
              </div>
            ))}
            <button className="btn btn-sm" style={{ marginTop: 8, width: '100%' }}
              onClick={() => {
                const names = ['紫灵仙子', '银月', '墨大夫', '向之礼'];
                const available = names.filter(n => !friends.includes(n));
                if (available.length > 0) addFriend(available[0]);
              }}>
              + 添加仙友
            </button>
          </div>

          {/* 聊天窗口 */}
          <div className="chat-demo card">
            <div className="chat-header">
              <span>💬 {activeFriend}</span>
              <span className="chat-online">在线</span>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
              {messages.length === 0 && (
                <div className="chat-empty">还没有消息，发送传音开始对话吧</div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`chat-msg ${msg.self ? 'self' : ''}`}>
                  <div className="chat-msg-avatar">{msg.avatar}</div>
                  <div className="chat-bubble">{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入传音内容..."
              />
              <button className="btn btn-solid" onClick={handleSend}>发送</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== 故事线 ==========
function TimelineSection() {
  const { currentVolume, advanceStory, currentRealm } = useGameStore();
  const addToast = useToastStore(s => s.addToast);
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="timeline" className="section">
      <div className="container">
        <h2 className="section-title">📖 十卷故事线</h2>
        <p className="section-sub">从山村少年到大道无尽</p>

        <div className="timeline">
          {STORY_VOLUMES.map(v => {
            const active = currentVolume === v.vol;
            const completed = currentVolume > v.vol;
            const locked = v.vol > currentVolume;
            return (
              <div key={v.vol} className={`timeline-item ${active ? 'active' : ''} ${completed ? 'completed' : ''} ${locked ? 'locked' : ''}`}>
                <div className="timeline-dot" />
                <div className="timeline-content card">
                  <div className="timeline-vol">第{['一','二','三','四','五','六','七','八','九','十'][v.vol-1]}卷</div>
                  <h3>{v.name}</h3>
                  <p>{v.desc}</p>
                  <span className="tag tag-green">{v.milestone}</span>
                  {active && currentRealm >= v.vol && (
                    <button className="btn btn-sm btn-primary" style={{ marginTop: 8 }}
                      onClick={() => {
                        if (advanceStory()) addToast(`完成第${v.vol}卷！`, 'success');
                      }}>
                      推进剧情
                    </button>
                  )}
                  {completed && <div className="timeline-done">✓ 已完成</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* 经典语录 */}
        <div className="quote-section card" style={{ marginTop: 60 }}>
          <div className="quote-text">{QUOTES[quoteIdx].text}</div>
          <div className="quote-author">{QUOTES[quoteIdx].author}</div>
        </div>
      </div>
    </section>
  );
}

// ========== 修仙挑战小游戏 ==========
function MinigameSection() {
  const { currentRealm, earnStones } = useGameStore();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle');
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSeq, setPlayerSeq] = useState<string[]>([]);
  const [showIdx, setShowIdx] = useState(-1);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameResult, setGameResult] = useState('');

  const elements = ['⚔️', '🛡️', '🔥', '💧', '🌿'];

  const startGame = () => {
    const len = 3 + Math.floor(currentRealm / 2);
    const seq = Array.from({ length: len }, () => elements[Math.floor(Math.random() * elements.length)]);
    setSequence(seq);
    setPlayerSeq([]);
    setScore(0);
    setRound(0);
    setGameState('playing');
    setShowIdx(0);

    // Show sequence
    let i = 0;
    const showInterval = setInterval(() => {
      setShowIdx(i);
      i++;
      if (i >= seq.length) {
        clearInterval(showInterval);
        setTimeout(() => setShowIdx(-1), 600);
      }
    }, 600);
  };

  const handleElementClick = (el: string) => {
    if (gameState !== 'playing' || showIdx >= 0) return;

    const newSeq = [...playerSeq, el];
    setPlayerSeq(newSeq);

    if (el !== sequence[newSeq.length - 1]) {
      // Wrong!
      const reward = score * 50 * currentRealm;
      if (reward > 0) earnStones(reward);
      setGameResult(`挑战失败！答对${score}个，获得${reward}灵石`);
      setGameState('result');
      return;
    }

    if (newSeq.length === sequence.length) {
      // Completed round!
      const newScore = score + 1;
      setScore(newScore);
      setRound(r => r + 1);

      // Next round with longer sequence
      const newLen = sequence.length + 1;
      const newSeqArr = Array.from({ length: newLen }, () => elements[Math.floor(Math.random() * elements.length)]);
      setSequence(newSeqArr);
      setPlayerSeq([]);
      setShowIdx(0);

      let idx = 0;
      const showInterval = setInterval(() => {
        setShowIdx(idx);
        idx++;
        if (idx >= newSeqArr.length) {
          clearInterval(showInterval);
          setTimeout(() => setShowIdx(-1), 600);
        }
      }, 600);
    }
  };

  const endGame = () => {
    const reward = score * 100 * currentRealm;
    if (reward > 0) earnStones(reward);
    setGameResult(`挑战结束！完成${score}轮，获得${reward}灵石`);
    setGameState('result');
  };

  return (
    <section id="minigame" className="section">
      <div className="container">
        <h2 className="section-title">🎮 修仙挑战</h2>
        <p className="section-sub">考验记忆 · 修心之道</p>

        <div className="minigame-panel card" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h3>五行记忆挑战</h3>
          <p>记住五行符号的顺序，依次点击复现。境界越高，序列越长！</p>

          {gameState === 'idle' && (
            <div>
              <p>当前境界: {REALMS[currentRealm - 1]?.name} (序列长度: {3 + Math.floor(currentRealm / 2)})</p>
              <button className="btn btn-primary btn-lg" style={{ marginTop: 16 }} onClick={startGame}>
                开始挑战
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div>
              <div className="minigame-info">
                <span>第 {round + 1} 轮</span>
                <span>得分: {score}</span>
                <span>序列: {sequence.length}个</span>
              </div>

              {showIdx >= 0 ? (
                <div className="minigame-display">
                  <div className="minigame-showing">{sequence[showIdx]}</div>
                  <p>记住顺序...</p>
                </div>
              ) : (
                <div>
                  <p>请依次点击: ({playerSeq.length}/{sequence.length})</p>
                  <div className="minigame-buttons">
                    {elements.map((el, i) => (
                      <button key={i} className="minigame-btn" onClick={() => handleElementClick(el)}>
                        {el}
                      </button>
                    ))}
                  </div>
                  <div className="minigame-player-seq">
                    {playerSeq.map((el, i) => <span key={i}>{el}</span>)}
                  </div>
                </div>
              )}

              <button className="btn btn-sm" style={{ marginTop: 16 }} onClick={endGame}>
                结束挑战
              </button>
            </div>
          )}

          {gameState === 'result' && (
            <div>
              <div className="minigame-result">{gameResult}</div>
              <button className="btn btn-primary btn-lg" style={{ marginTop: 16 }} onClick={startGame}>
                再次挑战
              </button>
              <button className="btn btn-lg" style={{ marginTop: 8 }} onClick={() => setGameState('idle')}>
                返回
              </button>
            </div>
          )}
        </div>

        {/* 排行榜 */}
        <h3 className="section-title" style={{ fontSize: '1.5rem', marginTop: 60 }}>🏆 境界排行榜</h3>
        <div className="rank-list">
          {[
            { name: '向之礼', realm: '化神期', pct: 99 },
            { name: useGameStore.getState().playerName, realm: REALMS[currentRealm - 1]?.name, pct: Math.min(currentRealm * 10 + 5, 95) },
            { name: '南宫婉', realm: '元婴期', pct: 80 },
            { name: '墨大夫', realm: '金丹期', pct: 55 },
            { name: '呼言老道', realm: '元婴期', pct: 50 },
          ].sort((a, b) => b.pct - a.pct).map((r, i) => (
            <div key={i} className="rank-item card">
              <div className={`rank-num rank-${i + 1}`}>{i + 1}</div>
              <div className="rank-info">
                <div className="rank-name">{r.name}</div>
                <div className="rank-realm">{r.realm}</div>
              </div>
              <div className="rank-bar-wrap">
                <div className="rank-bar" style={{ width: `${r.pct}%` }} />
              </div>
              <div className="rank-pct">{r.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== Footer ==========
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>⚔️ 凡人修仙传 · 仙缘大陆 · React拓展版 v3.0</p>
        <p style={{ marginTop: 8 }}>大道无尽 · 修仙无止境</p>
      </div>
    </footer>
  );
}

// ========== 主应用 ==========
export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const checkAchievements = useGameStore(s => s.checkAchievements);
  const addToast = useToastStore(s => s.addToast);

  // 定期检查成就
  useEffect(() => {
    const iv = setInterval(() => {
      const newAch = checkAchievements();
      newAch.forEach(a => addToast(`🏆 成就达成: ${a}！`, 'success'));
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  // 滚动观察器
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .card, .section-title, .section-sub').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activeSection]);

  const handleNav = (section: string) => {
    setActiveSection(section);
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="app">
      <Toasts />
      <Navbar activeSection={activeSection} onNav={handleNav} />
      <HeroSection onNav={handleNav} />
      <CultivationSection />
      <WorldSection />
      <CharactersSection />
      <TreasuresSection />
      <HerbsSection />
      <QuestsSection />
      <AuctionSection />
      <AchievementsSection />
      <SocialSection />
      <TimelineSection />
      <MinigameSection />
      <Footer />
    </div>
  );
}
