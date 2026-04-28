import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GEAR_CATEGORIES, gearCategoryLabel, type GearCategory } from '../types';

export default function TripForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { gearItems, trips, addTrip, updateTrip } = useStore();
  const existingTrip = id ? trips.find(t => t.id === id) : undefined;
  const isEdit = !!existingTrip;

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [route, setRoute] = useState('');
  const [distance, setDistance] = useState('');
  const [elevation, setElevation] = useState('');
  const [plan, setPlan] = useState('');
  const [members, setMembers] = useState('');
  const [filter, setFilter] = useState<GearCategory | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    if (existingTrip) {
      setTitle(existingTrip.title);
      setLocation(existingTrip.location);
      setStartDate(existingTrip.startDate);
      setEndDate(existingTrip.endDate);
      setRoute(existingTrip.route ?? '');
      setDistance(existingTrip.distance?.toString() ?? '');
      setElevation(existingTrip.elevation?.toString() ?? '');
      setMembers(existingTrip.members.join(', '));
      setPlan(existingTrip.plan ?? '');
      setSelected(new Set(existingTrip.gearList.map(tg => tg.gearId)));
    }
  }, [existingTrip]);

  if (id && !existingTrip) {
    return (
      <div className="page">
        <div style={{ marginBottom: 16 }}>
          <Link to="/trips" className="back-link">← 返回行程列表</Link>
        </div>
        <div className="empty-state"><p>行程不存在</p></div>
      </div>
    );
  }

  const filtered = filter === 'all' ? gearItems : gearItems.filter(g => g.category === filter);
  const toggleSelect = (gearId: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(gearId)) next.delete(gearId); else next.add(gearId);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !startDate || !endDate) return;
    if (endDate < startDate) {
      setDateError('结束日期不能早于出发日期');
      return;
    }
    setDateError('');
    const data = {
      title: title.trim(),
      location: location.trim(),
      startDate,
      endDate,
      route: route.trim() || undefined,
      distance: distance ? Number(distance) : undefined,
      elevation: elevation ? Number(elevation) : undefined,
      plan: plan.trim() || undefined,
      members: members.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      gearList: Array.from(selected).map(gearId => {
        const existing = existingTrip?.gearList.find(tg => tg.gearId === gearId);
        return { gearId, packed: existing?.packed ?? false, assignee: existing?.assignee };
      }),
      status: existingTrip?.status ?? 'planned',
    };
    if (isEdit) {
      updateTrip(id!, data);
    } else {
      addTrip(data);
    }
    navigate('/trips');
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 16 }}>
        <Link to="/trips" className="back-link">← 返回行程列表</Link>
      </div>
      <h1 className="page-title">{isEdit ? '编辑行程' : '新行程'}</h1>

      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-group">
          <label>标题 *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="例: 五一千八线重装徒步" required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>地点 *</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="例: 丽水龙泉" required />
          </div>
          <div className="form-group">
            <label>队友</label>
            <input value={members} onChange={e => setMembers(e.target.value)} placeholder="逗号分隔" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>出发日期 *</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>结束日期 *</label>
            <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setDateError(''); }} required />
          </div>
        </div>
        {dateError && <p style={{ color: '#c44536', fontSize: 13, marginTop: -8, marginBottom: 14 }}>{dateError}</p>}
        <div className="form-group">
          <label>路线描述</label>
          <input value={route} onChange={e => setRoute(e.target.value)} placeholder="例: 粗坑→凤阳山→黄茅尖→凤阳湖→南溪村" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>距离 (km)</label>
            <input type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="可选" />
          </div>
          <div className="form-group">
            <label>爬升 (m)</label>
            <input type="number" value={elevation} onChange={e => setElevation(e.target.value)} placeholder="可选" />
          </div>
        </div>

        <div className="form-group">
          <label>行程计划 (HTML)</label>
          <textarea rows={8} value={plan} onChange={e => setPlan(e.target.value)}
            placeholder="输入 HTML 格式的详细行程计划，留空则不显示" style={{ fontFamily: 'monospace', fontSize: 13 }} />
        </div>

        {gearItems.length > 0 && (
          <div className="form-group">
            <label>选择要带的装备</label>
            <div className="filter-tabs" style={{ marginBottom: 8 }}>
              <button type="button" className={`tab small ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}>全部</button>
              {GEAR_CATEGORIES.map(cat => (
                <button type="button" key={cat.value}
                  className={`tab small ${filter === cat.value ? 'active' : ''}`}
                  onClick={() => setFilter(cat.value)}>
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="gear-select-grid">
              {filtered.map(item => (
                <label key={item.id} className={`gear-select-item${selected.has(item.id) ? ' selected' : ''}`}>
                  <input type="checkbox" checked={selected.has(item.id)}
                    onChange={() => toggleSelect(item.id)} />
                  <span className="gear-select-name">{item.name}</span>
                  <span className="gear-select-cat">{gearCategoryLabel(item.category)}</span>
                </label>
              ))}
            </div>
            {selected.size > 0 && <p className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>已选 {selected.size} 件</p>}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate('/trips')}>取消</button>
          <button type="submit" className="btn btn-primary">{isEdit ? '保存修改' : '创建行程'}</button>
        </div>
      </form>
    </div>
  );
}
