import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GEAR_CATEGORIES, gearCategoryLabel, type GearCategory, type Trip, type TripRiskInfo } from '../types';
import { ArrowLeft, Route, AlertCircle, ShieldAlert, WandSparkles } from 'lucide-react';

interface TripFormFieldsProps {
  existingTrip?: Trip;
  gearItems: ReturnType<typeof useStore>['gearItems'];
  addTrip: ReturnType<typeof useStore>['addTrip'];
  updateTrip: ReturnType<typeof useStore>['updateTrip'];
}

export default function TripForm() {
  const { id } = useParams<{ id: string }>();
  const { gearItems, trips, addTrip, updateTrip } = useStore();
  const existingTrip = id ? trips.find(t => t.id === id) : undefined;

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

  return (
    <TripFormFields
      key={existingTrip?.id ?? 'new'}
      existingTrip={existingTrip}
      gearItems={gearItems}
      addTrip={addTrip}
      updateTrip={updateTrip}
    />
  );
}

function TripFormFields({ existingTrip, gearItems, addTrip, updateTrip }: TripFormFieldsProps) {
  const navigate = useNavigate();
  const isEdit = Boolean(existingTrip);
  const [title, setTitle] = useState(existingTrip?.title ?? '');
  const [location, setLocation] = useState(existingTrip?.location ?? '');
  const [startDate, setStartDate] = useState(existingTrip?.startDate ?? '');
  const [endDate, setEndDate] = useState(existingTrip?.endDate ?? '');
  const [route, setRoute] = useState(existingTrip?.route ?? '');
  const [trackUrl, setTrackUrl] = useState(existingTrip?.trackUrl ?? '');
  const [distance, setDistance] = useState(existingTrip?.distance?.toString() ?? '');
  const [elevation, setElevation] = useState(existingTrip?.elevation?.toString() ?? '');
  const [plan, setPlan] = useState(existingTrip?.plan ?? '');
  const [members, setMembers] = useState(existingTrip?.members.join(', ') ?? '');
  const [weather, setWeather] = useState(existingTrip?.riskInfo?.weather ?? '');
  const [supply, setSupply] = useState(existingTrip?.riskInfo?.supply ?? '');
  const [transport, setTransport] = useState(existingTrip?.riskInfo?.transport ?? '');
  const [emergency, setEmergency] = useState(existingTrip?.riskInfo?.emergency ?? '');
  const [notes, setNotes] = useState(existingTrip?.riskInfo?.notes ?? '');
  const [filter, setFilter] = useState<GearCategory | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(existingTrip?.gearList.map(tg => tg.gearId) ?? [])
  );
  const [dateError, setDateError] = useState('');

  const filtered = filter === 'all' ? gearItems : gearItems.filter(g => g.category === filter);
  const toggleSelect = (gearId: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(gearId)) next.delete(gearId); else next.add(gearId);
      return next;
    });
  };

  const buildRiskInfo = (): TripRiskInfo | undefined => {
    const info: TripRiskInfo = {
      weather: weather.trim() || undefined,
      supply: supply.trim() || undefined,
      transport: transport.trim() || undefined,
      emergency: emergency.trim() || undefined,
      notes: notes.trim() || undefined,
    };
    return Object.values(info).some(Boolean) ? info : undefined;
  };

  const applyStyledPlanTemplate = () => {
    if (plan.trim() && !window.confirm('当前行程计划已有内容，是否用美化模板覆盖？')) return;
    const planTitle = escapeHtml(title.trim() || '行程标题');
    const place = escapeHtml(location.trim() || '目的地');
    const start = startDate || '出发日期';
    const end = endDate || '结束日期';
    const routeText = escapeHtml(route.trim() || '起点 → 关键节点 → 终点');
    const distanceText = distance ? `${distance}km` : '待补充';
    const elevationText = elevation ? `${elevation}m` : '待补充';
    const memberText = escapeHtml(members.trim() || '队友待补充');
    const supplyText = escapeHtml(supply.trim() || '补给、水源和撤退点待补充');
    const weatherText = escapeHtml(weather.trim() || '出发前 24 小时复查天气、风力、降雨和低温风险');

    setPlan(`<div class="otw-plan">
  <section class="otw-plan-hero">
    <span class="otw-plan-kicker">Outdoor Itinerary</span>
    <h1>${planTitle}</h1>
    <p>${place} · ${start} ~ ${end}</p>
  </section>

  <section class="otw-plan-grid">
    <div class="otw-plan-stat"><strong>${distanceText}</strong><span>总里程</span></div>
    <div class="otw-plan-stat"><strong>${elevationText}</strong><span>累计爬升</span></div>
    <div class="otw-plan-stat"><strong>${memberText}</strong><span>同行人员</span></div>
  </section>

  <section class="otw-plan-card">
    <h2>路线概览</h2>
    <p>${routeText}</p>
  </section>

  <section class="otw-plan-timeline">
    <article>
      <time>D0 / 集合</time>
      <h3>抵达起点与营地准备</h3>
      <p>确认交通、停车、补水和首晚扎营位置；睡前复核第二天装备和天气。</p>
    </article>
    <article>
      <time>D1 / 主线推进</time>
      <h3>核心爬升与主要景观点</h3>
      <p>按实际轨迹拆分关键节点、午餐点、水源和预估到达时间。</p>
    </article>
    <article>
      <time>D2 / 返程</time>
      <h3>下撤、补给与返程衔接</h3>
      <p>明确下撤路线、包车或公共交通联系人，以及最晚下山时间。</p>
    </article>
  </section>

  <section class="otw-plan-alert">
    <h2>出发前确认</h2>
    <ul>
      <li>${weatherText}</li>
      <li>${supplyText}</li>
      <li>离线轨迹、应急联系人、头灯和保暖层必须复核。</li>
    </ul>
  </section>
</div>`);
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
      riskInfo: buildRiskInfo(),
      members: members.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      gearList: Array.from(selected).map(gearId => {
        const existing = existingTrip?.gearList.find(tg => tg.gearId === gearId);
        return { gearId, packed: existing?.packed ?? false, assignee: existing?.assignee };
      }),
      status: existingTrip?.status ?? 'planned',
    };
    if (isEdit && existingTrip) {
      updateTrip(existingTrip.id, data);
    } else {
      addTrip(data);
    }
    navigate('/trips');
  };

  return (
    <div className="page">
      <div className="mb-4 print:hidden">
        <Link to="/trips" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent transition-colors">
          <ArrowLeft size={14} /> 返回行程列表
        </Link>
      </div>

      <h1 className="text-2xl font-extrabold flex items-center gap-2 mb-6">
        <Route size={24} className="text-accent" />
        {isEdit ? '编辑行程' : '新行程'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-surface rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-8 space-y-5">
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
            <input type="number" min={0} value={distance} onChange={e => setDistance(e.target.value)} placeholder="可选"
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
          </div>
          <div>
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">爬升 (m)</label>
            <input type="number" min={0} value={elevation} onChange={e => setElevation(e.target.value)} placeholder="可选"
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface" />
          </div>
        </div>

        <section className="rounded-3xl border border-amber-light bg-amber-light/20 p-4 sm:p-5 space-y-4">
          <h2 className="font-extrabold text-sm flex items-center gap-2 text-amber">
            <ShieldAlert size={16} />
            出发前风险信息
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RiskInput label="天气" value={weather} onChange={setWeather} placeholder="例: 出发前一天复查龙泉山区天气" />
            <RiskInput label="补给" value={supply} onChange={setSupply} placeholder="例: 凤阳湖后全天无补给，每人 3L 水" />
            <RiskInput label="交通" value={transport} onChange={setTransport} placeholder="例: 南溪村包车回粗坑，提前联系" />
            <RiskInput label="紧急联系人" value={emergency} onChange={setEmergency} placeholder="例: 队长/司机/景区电话" />
          </div>
          <RiskInput label="注意事项" value={notes} onChange={setNotes} placeholder="例: 夜间山路慢行，雨衣和保暖层必带" multiLine />
        </section>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1.5">
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 block">行程计划</label>
            <button
              type="button"
              onClick={applyStyledPlanTemplate}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-all active:scale-95 cursor-pointer"
            >
              <WandSparkles size={14} />
              套用分享样式模板
            </button>
          </div>
          <textarea rows={8} value={plan} onChange={e => setPlan(e.target.value)}
            placeholder="建议使用带 .otw-plan 样式类的 HTML 片段，页面会直接渲染为分享友好的卡片式计划；留空则不显示"
            className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface resize-y min-h-[120px] font-mono" />
          <p className="text-xs text-slate-400 mt-2">展示时直接渲染在页面内，并自动移除脚本、事件属性和危险链接。后续让 agent 生成计划时，应输出带前端样式的 HTML 片段，不要只给纯文本。</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-72 overflow-y-auto p-2">
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

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
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

function RiskInput({ label, value, onChange, placeholder, multiLine }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiLine?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">{label}</label>
      {multiLine ? (
        <textarea
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface"
        />
      )}
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
