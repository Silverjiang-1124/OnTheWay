import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { gearCategoryLabel } from '../types';
import { useState } from 'react';

type AssigneeFilter = '全部' | '我' | '公共' | '队友';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const { trips, gearItems, updateTrip, togglePacked } = useStore();

  const trip = trips.find(t => t.id === id);
  if (!trip) {
    return <div className="page"><div className="empty-state"><p>行程不存在</p><Link to="/trips">返回列表</Link></div></div>;
  }

  const [editingJournal, setEditingJournal] = useState(false);
  const [journalText, setJournalText] = useState(trip.journal ?? '');
  const [rating, setRating] = useState(trip.rating ?? 0);
  const [showPlan, setShowPlan] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>('我');

  const gearMap = new Map(gearItems.map(g => [g.id, g]));

  const filteredGearList = trip.gearList.filter(tg => {
    if (assigneeFilter === '全部') return true;
    const gear = gearMap.get(tg.gearId);
    if (!gear) return false;
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
    updateTrip(trip.id, { journal: journalText || undefined, rating: rating || undefined, status: 'completed' });
    setEditingJournal(false);
  };

  const assigneeCounts = {
    全部: trip.gearList.length,
    我: trip.gearList.filter(tg => (tg.assignee ?? '我') === '我').length,
    公共: trip.gearList.filter(tg => tg.assignee === '公共').length,
    队友: trip.gearList.filter(tg => tg.assignee === '队友').length,
  };

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
        <span className={`status-badge ${trip.status}`}>
          {trip.status === 'planned' ? '待出发' : '已完成'}
        </span>
      </div>

      {trip.plan && (
        <section className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>📋 行程计划</h2>
            <button className="btn" onClick={() => setShowPlan(!showPlan)}>
              {showPlan ? '收起' : '展开'}
            </button>
          </div>
          {showPlan && (
            <div className="plan-html-wrap">
              <div dangerouslySetInnerHTML={{ __html: trip.plan }} />
            </div>
          )}
        </section>
      )}

      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>
            🎒 打包清单
            <span className="text-muted" style={{ fontSize: 14, fontWeight: 400, marginLeft: 8 }}>
              ({packedCount}/{totalCount})
            </span>
          </h2>
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
            <p>该筛选条件下没有装备</p>
          </div>
        )}

        {Object.entries(groupedGear).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <h3 className="cat-title">{cat}</h3>
            {items.map(item => (
              <label key={item.gearId} className="packing-row">
                <input type="checkbox" checked={item.packed}
                  onChange={() => togglePacked(trip.id, item.gearId)} />
                <span className={item.packed ? 'packed-text' : ''}>{item.name}</span>
                {item.assignee && assigneeFilter === '全部' && (
                  <span className={`assignee-tag ${item.assignee}`}>{item.assignee}</span>
                )}
              </label>
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
    </div>
  );
}
