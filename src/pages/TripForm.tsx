import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GEAR_CATEGORIES, gearCategoryLabel, type GearCategory } from '../types';
import { ArrowLeft, Route, AlertCircle } from 'lucide-react';

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
  const [trackUrl, setTrackUrl] = useState('');
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
      setTrackUrl(existingTrip.trackUrl ?? '');
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
        <div className="mb-4">
          <Link to="/trips" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent transition-colors">
            <ArrowLeft size={14} /> 返回行程列表
          </Link>
        </div>
        <div className="py-20 text-center text-slate-500"><p>行程不存在</p></div>
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
      trackUrl: trackUrl.trim() || undefined,
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
      <div className="mb-4">
        <Link to="/trips" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent transition-colors">
          <ArrowLeft size={14} /> 返回行程列表
        </Link>
      </div>

      <h1 className="text-2xl font-extrabold flex items-center gap-2 mb-6">
        <Route size={24} className="text-accent" />
        {isEdit ? '编辑行程' : '新行程'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-surface rounded-3xl border border-slate-100 shadow-sm p-8 space-y-5">
        <div>
          <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">标题 *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="例: 五一千八线重装徒步" required
            className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">地点 *</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="例: 丽水龙泉" required
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
          </div>
          <div>
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">队友</label>
            <input value={members} onChange={e => setMembers(e.target.value)} placeholder="逗号分隔"
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">出发日期 *</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
          </div>
          <div>
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">结束日期 *</label>
            <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setDateError(''); }} required
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
          </div>
        </div>

        {dateError && (
          <div className="flex items-center gap-2 text-sm text-red bg-red-light px-4 py-3 rounded-2xl">
            <AlertCircle size={16} />
            {dateError}
          </div>
        )}

        <div>
          <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">路线描述</label>
          <input value={route} onChange={e => setRoute(e.target.value)} placeholder="例: 粗坑→凤阳山→黄茅尖→凤阳湖→南溪村"
            className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
        </div>

        <div>
          <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">轨迹下载链接</label>
          <input value={trackUrl} onChange={e => setTrackUrl(e.target.value)} placeholder="例: https://www.2bulu.com/track/xxx 或 GPX 文件直链"
            className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">距离 (km)</label>
            <input type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="可选"
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
          </div>
          <div>
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">爬升 (m)</label>
            <input type="number" value={elevation} onChange={e => setElevation(e.target.value)} placeholder="可选"
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">行程计划 (HTML)</label>
          <textarea rows={8} value={plan} onChange={e => setPlan(e.target.value)}
            placeholder="输入 HTML 格式的详细行程计划，留空则不显示"
            className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface resize-y min-h-[120px] font-mono" />
        </div>

        {gearItems.length > 0 && (
          <div>
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">选择要带的装备</label>
            <div className="flex gap-2 flex-wrap mb-3">
              <button type="button"
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95 cursor-pointer ${
                  filter === 'all'
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'border-slate-100 bg-surface text-slate-600 hover:bg-accent-light hover:text-accent'
                }`}
                onClick={() => setFilter('all')}>全部</button>
              {GEAR_CATEGORIES.map(cat => (
                <button type="button" key={cat.value}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95 cursor-pointer ${
                    filter === cat.value
                      ? 'bg-accent text-white border-accent shadow-sm'
                      : 'border-slate-100 bg-surface text-slate-600 hover:bg-accent-light hover:text-accent'
                  }`}
                  onClick={() => setFilter(cat.value)}>{cat.label}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-72 overflow-y-auto p-2">
              {filtered.map(item => (
                <label key={item.id}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border text-sm cursor-pointer transition-all ${
                    selected.has(item.id)
                      ? 'border-accent bg-accent-light'
                      : 'border-slate-100 hover:bg-accent-light/30'
                  }`}>
                  <input type="checkbox" checked={selected.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="accent-accent" />
                  <span className="flex-1">{item.name}</span>
                  <span className="text-[10px] text-slate-400">{gearCategoryLabel(item.category)}</span>
                </label>
              ))}
            </div>
            {selected.size > 0 && (
              <p className="text-sm text-slate-500 mt-2">
                已选 <span className="text-accent font-extrabold">{selected.size}</span> 件
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button type="button" onClick={() => navigate('/trips')}
            className="px-5 py-2.5 border border-slate-100 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-all active:scale-95 cursor-pointer">
            取消
          </button>
          <button type="submit"
            className="px-5 py-2.5 bg-accent text-white rounded-2xl text-sm font-semibold hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer">
            {isEdit ? '保存修改' : '创建行程'}
          </button>
        </div>
      </form>
    </div>
  );
}
