import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GEAR_CATEGORIES, gearCategoryLabel, type GearCategory } from '../types';
import { useRef, useState } from 'react';

type AssigneeFilter = '全部' | '我' | '公共' | '队友';

export default function TripDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { trips, gearItems, updateTrip, deleteTrip, togglePacked, addGearToTrip, removeGearFromTrip } = useStore();

  const trip = trips.find(t => t.id === id);
  if (!trip) {
    return <div className="page"><div className="empty-state"><p>行程不存在</p><Link to="/trips">返回列表</Link></div></div>;
  }

  const [editingJournal, setEditingJournal] = useState(false);
  const [journalText, setJournalText] = useState(trip.journal ?? '');
  const [rating, setRating] = useState(trip.rating ?? 0);
  const [showPlan, setShowPlan] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>('我');
  const [showAddGear, setShowAddGear] = useState(false);
  const [addFilter, setAddFilter] = useState<GearCategory | 'all'>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const gearMap = new Map(gearItems.map(g => [g.id, g]));
  const tripGearIds = new Set(trip.gearList.map(tg => tg.gearId));

  // Available gear (not yet in trip)
  const availableGear = gearItems.filter(g => !tripGearIds.has(g.id));
  const filteredAvailable = addFilter === 'all'
    ? availableGear
    : availableGear.filter(g => g.category === addFilter);

  // Packing list
  const filteredGearList = trip.gearList.filter(tg => {
    if (assigneeFilter === '全部') return true;
    return (tg.assignee ?? '我') === assigneeFilter;
  });

  const groupedGear: Record<string, { gearId: string; name: string; packed: boolean; assignee?: string }[]> = {};
  for (const tg of filteredGearList) {
    const gear = gearMap.get(tg.gearId);
    if (!gear) continue;
    const cat = gearCategoryLabel(gear.category);
    if (!groupedGear[cat]) groupedGear[cat] = [];
    groupedGear[cat].push({ gearId: tg.gearId, name: gear.name, packed: tg.packed, assignee: tg.assignee });
  }

  const packedCount = filteredGearList.filter(g => g.packed).length;
  const totalCount = filteredGearList.length;

  const handleSaveJournal = () => {
    updateTrip(trip.id, { journal: journalText || undefined, rating: rating || undefined });
    setEditingJournal(false);
  };

  const toggleStatus = () => {
    updateTrip(trip.id, { status: trip.status === 'completed' ? 'planned' : 'completed' });
  };

  const handleCopySummary = (t: typeof trip, done: (v: boolean) => void) => {
    const gearById = new Map(gearItems.map(g => [g.id, g]));
    const lines: string[] = [];
    lines.push(`🏔️ ${t.title}`);
    lines.push(`📍 ${t.location}  |  📅 ${t.startDate} ~ ${t.endDate}`);
    if (t.route) lines.push(`🗺️ ${t.route}`);
    if (t.distance || t.elevation) {
      const parts: string[] = [];
      if (t.distance) parts.push(`📏 ${t.distance}km`);
      if (t.elevation) parts.push(`🏔️ ${t.elevation}m`);
      if (t.members.length) parts.push(`👥 ${t.members.join(', ')}`);
      lines.push(parts.join('  |  '));
    }
    lines.push('');

    if (t.plan) {
      lines.push('━'.repeat(20));
      lines.push('📋 行程计划');
      lines.push('━'.repeat(20));
      lines.push(stripHtml(t.plan).trim());
      lines.push('');
    }

    if (t.gearList.length > 0) {
      lines.push('━'.repeat(20));
      lines.push('🎒 打包清单');
      lines.push('━'.repeat(20));
      const catGroups: Record<string, string[]> = {};
      for (const tg of t.gearList) {
        const g = gearById.get(tg.gearId);
        if (!g) continue;
        const cat = gearCategoryLabel(g.category);
        if (!catGroups[cat]) catGroups[cat] = [];
        const mark = tg.packed ? '✅' : '⬜';
        const who = tg.assignee ? ` (${tg.assignee})` : '';
        catGroups[cat].push(`  ${mark} ${g.name}${who}`);
      }
      for (const [cat, items] of Object.entries(catGroups)) {
        lines.push(`\n${cat}`);
        lines.push(...items);
      }
      lines.push('');
    }

    if (t.journal) {
      lines.push('━'.repeat(20));
      lines.push('📝 游记');
      lines.push('━'.repeat(20));
      lines.push(t.journal);
    }

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      done(true);
      setTimeout(() => done(false), 2000);
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = lines.join('\n');
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done(true);
      setTimeout(() => done(false), 2000);
    });
  };

  const handleAddGear = (gearId: string, assignee?: string) => {
    const a = assignee ?? (assigneeFilter === '全部' ? undefined : assigneeFilter);
    addGearToTrip(trip.id, gearId, a);
  };

  const assigneeCounts = {
    全部: trip.gearList.length,
    我: trip.gearList.filter(tg => (tg.assignee ?? '我') === '我').length,
    公共: trip.gearList.filter(tg => tg.assignee === '公共').length,
    队友: trip.gearList.filter(tg => tg.assignee === '队友').length,
  };

  const planDoc = trip.plan ? wrapPlanHtml(trip.plan) : '';

  return (
    <div className="page">
      <div style={{ marginBottom: 16 }}>
        <Link to="/trips" className="back-link">← 返回行程列表</Link>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{trip.title}</h1>
          <div className="trip-detail-meta">
            <span>📍 {trip.location}</span>
            <span>📅 {trip.startDate} ~ {trip.endDate}</span>
            {trip.distance && <span>📏 {trip.distance}km</span>}
            {trip.elevation && <span>🏔️ {trip.elevation}m</span>}
            {trip.members.length > 0 && <span>👥 {trip.members.join(', ')}</span>}
          </div>
          {trip.route && <div className="trip-route">🗺️ {trip.route}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }} className="export-btn-wrap">
          <Link to={`/trips/${trip.id}/edit`} className="btn btn-export">编辑</Link>
          <button className={`status-badge ${trip.status} clickable`} onClick={toggleStatus} title="点击切换状态">
            {trip.status === 'planned' ? '待出发' : '已完成'}
          </button>
          <button className="btn btn-export" style={{ color: '#c44536' }} onClick={() => {
            if (window.confirm(`确定删除行程「${trip.title}」吗？此操作不可恢复。`)) {
              deleteTrip(trip.id);
              navigate('/trips');
            }
          }}>删除</button>
          <button className="btn btn-export" onClick={() => setShowExportMenu(!showExportMenu)}>
            导出 ▾
          </button>
          {showExportMenu && (
            <>
              <div className="export-overlay" onClick={() => setShowExportMenu(false)} />
              <div className="export-menu">
                <button className="export-menu-item" onClick={() => { window.print(); setShowExportMenu(false); }}>
                  🖨️ 打印 / PDF
                </button>
                <button className="export-menu-item" onClick={() => handleCopySummary(trip, setCopied)}>
                  📋 {copied ? '已复制!' : '复制文字摘要'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {trip.plan && (
        <section className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>📋 行程计划</h2>
            <button className="btn" onClick={() => setShowPlan(!showPlan)}>
              {showPlan ? '收起' : '展开'}
            </button>
          </div>
          <div className={`plan-iframe-wrap${showPlan ? '' : ' plan-hidden'}`}>
            <iframe ref={iframeRef} className="plan-iframe" srcDoc={planDoc} title="行程计划" />
          </div>
        </section>
      )}

      {/* Print-only plan content — iframes can't expand in print */}
      {trip.plan && (
        <div className="plan-print-only">
          <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0, borderBottom: '2px solid var(--accent-light)', marginBottom: 12 }}>📋 行程计划</h2>
          <div className="plan-print-body" dangerouslySetInnerHTML={{ __html: trip.plan }} />
        </div>
      )}

      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>
            🎒 打包清单
            <span className="text-muted" style={{ fontSize: 14, fontWeight: 400, marginLeft: 8 }}>
              ({packedCount}/{totalCount})
            </span>
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={() => setShowAddGear(true)} disabled={gearItems.length === 0}>
              + 添加装备
            </button>
          </div>
        </div>

        <div className="filter-tabs" style={{ marginBottom: 14 }}>
          {(['全部', '我', '公共', '队友'] as const).map(a => (
            <button key={a} className={`tab ${assigneeFilter === a ? 'active' : ''}`}
              onClick={() => setAssigneeFilter(a)}>
              {a} <span className="count">{assigneeCounts[a]}</span>
            </button>
          ))}
        </div>

        {totalCount === 0 && (
          <div className="empty-state" style={{ padding: 20 }}>
            <p>还没有装备，点击「添加装备」从装备库导入</p>
            {gearItems.length === 0 && <p style={{ fontSize: 13, marginTop: 4 }}>装备库也没有，先去 <Link to="/gear">装备库</Link> 录入吧</p>}
          </div>
        )}

        {Object.entries(groupedGear).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <h3 className="cat-title">{cat}</h3>
            {items.map(item => (
              <div key={item.gearId} className="packing-row-wrap">
                <label className="packing-row" style={{ flex: 1 }}>
                  <input type="checkbox" checked={item.packed}
                    onChange={() => togglePacked(trip.id, item.gearId)} />
                  <span className={item.packed ? 'packed-text' : ''}>{item.name}</span>
                  {item.assignee && assigneeFilter === '全部' && (
                    <span className={`assignee-tag ${item.assignee}`}>{item.assignee}</span>
                  )}
                </label>
                <button className="btn-remove" title="移除此装备"
                  onClick={() => removeGearFromTrip(trip.id, item.gearId)}>✕</button>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="section">
        <h2 className="section-title">游记</h2>
        {trip.journal && !editingJournal ? (
          <div>
            {trip.rating && <div style={{ marginBottom: 8 }}>⭐ {'★'.repeat(trip.rating)}{'☆'.repeat(5 - trip.rating)}</div>}
            <div className="journal-text">{trip.journal}</div>
            <button className="btn" style={{ marginTop: 12 }} onClick={() => { setJournalText(trip.journal ?? ''); setRating(trip.rating ?? 0); setEditingJournal(true); }}>
              编辑
            </button>
          </div>
        ) : editingJournal ? (
          <div>
            <div className="form-group">
              <label>评分</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" className={`star ${n <= rating ? 'on' : ''}`}
                    onClick={() => setRating(n)}>★</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>记录</label>
              <textarea rows={6} value={journalText} onChange={e => setJournalText(e.target.value)}
                placeholder="天气、路况、印象深刻的事、感受…" />
            </div>
            <div className="form-actions">
              <button className="btn" onClick={() => setEditingJournal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSaveJournal}>保存</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-muted" style={{ marginBottom: 8 }}>还没有记录</p>
            <button className="btn btn-primary" onClick={() => setEditingJournal(true)}>写游记</button>
          </div>
        )}
      </section>

      {showAddGear && (
        <div className="modal-overlay" onClick={() => setShowAddGear(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">添加装备</h2>
            {availableGear.length === 0 ? (
              <p className="text-muted">装备库没有可添加的装备了</p>
            ) : (
              <>
                <div className="filter-tabs" style={{ marginBottom: 10 }}>
                  <button className={`tab small ${addFilter === 'all' ? 'active' : ''}`} onClick={() => setAddFilter('all')}>全部</button>
                  {GEAR_CATEGORIES.map(cat => {
                    const count = availableGear.filter(g => g.category === cat.value).length;
                    if (!count) return null;
                    return (
                      <button key={cat.value} className={`tab small ${addFilter === cat.value ? 'active' : ''}`}
                        onClick={() => setAddFilter(cat.value)}>
                        {cat.label} <span className="count">{count}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="gear-select-grid">
                  {filteredAvailable.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button className="gear-select-btn" style={{ flex: 1 }}
                        onClick={() => handleAddGear(item.id)}>
                        <span className="gear-select-name">{item.name}</span>
                        <span className="gear-select-cat">{gearCategoryLabel(item.category)}</span>
                      </button>
                      <select className="assignee-picker" title="指定负责人"
                        value={assigneeFilter === '全部' ? '我' : assigneeFilter}
                        onChange={e => handleAddGear(item.id, e.target.value)}
                        onClick={e => e.stopPropagation()}
                        style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, background: 'var(--surface)', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <option value="我">我</option>
                        <option value="公共">公共</option>
                        <option value="队友">队友</option>
                      </select>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="form-actions" style={{ marginTop: 16 }}>
              <div style={{ flex: 1 }} />
              <button className="btn" onClick={() => setShowAddGear(false)}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function wrapPlanHtml(fragment: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;background:#f7f5f0;font-family:-apple-system,'PingFang SC','Noto Sans SC','Microsoft YaHei',sans-serif;line-height:1.6;color:#2c2c2c;}</style>
</head><body style="padding:16px;">${fragment}</body></html>`;
}
