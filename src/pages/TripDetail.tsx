import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ASSIGNEES,
  GEAR_CATEGORIES,
  gearCategoryLabel,
  type Assignee,
  type GearCategory,
  type GearItem,
  type Trip,
  type TripGear,
} from '../types';
import {
  ArrowLeft, MapPin, Calendar, Ruler, Mountain, Users, MapIcon,
  Download, Edit3, FileDown, Printer, ClipboardList, Trash2, Backpack,
  Plus, X, Star, Frown, Scale, ShieldAlert
} from 'lucide-react';

type AssigneeFilter = '全部' | Assignee;

interface TripDetailContentProps {
  trip: Trip;
  gearItems: GearItem[];
  updateTrip: ReturnType<typeof useStore>['updateTrip'];
  deleteTrip: ReturnType<typeof useStore>['deleteTrip'];
  togglePacked: ReturnType<typeof useStore>['togglePacked'];
  addGearToTrip: ReturnType<typeof useStore>['addGearToTrip'];
  removeGearFromTrip: ReturnType<typeof useStore>['removeGearFromTrip'];
}

interface GearRow {
  gearId: string;
  name: string;
  packed: boolean;
  assignee?: Assignee;
  quantity: number;
  weight: number;
}

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const store = useStore();
  const trip = store.trips.find(t => t.id === id);

  if (!trip) {
    return (
      <div className="page">
        <div className="py-20 text-center text-slate-500">
          <Frown size={48} className="mx-auto mb-4 text-slate-300" />
          <p>行程不存在</p>
          <Link to="/trips" className="text-accent hover:underline text-sm mt-2 inline-block">返回列表</Link>
        </div>
      </div>
    );
  }

  return <TripDetailContent key={trip.id} trip={trip} {...store} />;
}

function TripDetailContent({
  trip,
  gearItems,
  updateTrip,
  deleteTrip,
  togglePacked,
  addGearToTrip,
  removeGearFromTrip,
}: TripDetailContentProps) {
  const navigate = useNavigate();
  const [editingJournal, setEditingJournal] = useState(false);
  const [journalText, setJournalText] = useState(trip.journal ?? '');
  const [rating, setRating] = useState(trip.rating ?? 0);
  const [showPlan, setShowPlan] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>('我');
  const [showAddGear, setShowAddGear] = useState(false);
  const [addFilter, setAddFilter] = useState<GearCategory | 'all'>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const gearMap = new Map(gearItems.map(g => [g.id, g]));
  const tripGearIds = new Set(trip.gearList.map(tg => tg.gearId));
  const availableGear = gearItems.filter(g => !tripGearIds.has(g.id));
  const filteredAvailable = addFilter === 'all'
    ? availableGear
    : availableGear.filter(g => g.category === addFilter);

  const filteredGearList = trip.gearList.filter(tg => {
    if (assigneeFilter === '全部') return true;
    return (tg.assignee ?? '我') === assigneeFilter;
  });

  const groupedGear: Record<string, GearRow[]> = {};
  for (const tg of filteredGearList) {
    const gear = gearMap.get(tg.gearId);
    if (!gear) continue;
    const cat = gearCategoryLabel(gear.category);
    if (!groupedGear[cat]) groupedGear[cat] = [];
    groupedGear[cat].push({
      gearId: tg.gearId,
      name: gear.name,
      packed: tg.packed,
      assignee: tg.assignee,
      quantity: gear.quantity,
      weight: gearWeight(gear),
    });
  }

  const packedCount = filteredGearList.filter(g => g.packed).length;
  const totalCount = filteredGearList.length;
  const allStats = summarizeGear(trip.gearList, gearMap);
  const filteredStats = summarizeGear(filteredGearList, gearMap);
  const byCategory = summarizeByCategory(filteredGearList, gearMap);
  const byAssignee = summarizeByAssignee(trip.gearList, gearMap);
  const packedPercent = allStats.count ? Math.round((allStats.packedCount / allStats.count) * 100) : 0;
  const riskEntries = riskInfoEntries(trip);
  const sanitizedPlan = trip.plan ? sanitizeHtml(trip.plan) : '';
  const planDoc = sanitizedPlan ? wrapPlanHtml(sanitizedPlan) : '';

  const handleSaveJournal = () => {
    updateTrip(trip.id, { journal: journalText || undefined, rating: rating || undefined });
    setEditingJournal(false);
  };

  const toggleStatus = () => {
    const newStatus = trip.status === 'completed' ? 'planned' : 'completed';
    if (newStatus === 'completed' && !window.confirm(`确认将「${trip.title}」标记为已完成？`)) return;
    updateTrip(trip.id, { status: newStatus });
  };

  const handleCopySummary = (done: (v: boolean) => void) => {
    const lines = buildSummaryText(trip, gearItems, sanitizedPlan, allStats);
    navigator.clipboard.writeText(lines).then(() => {
      done(true);
      setTimeout(() => done(false), 2000);
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = lines;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done(true);
      setTimeout(() => done(false), 2000);
    });
  };

  const handleAddGear = (gearId: string, assignee?: Assignee) => {
    const a = assignee ?? (assigneeFilter === '全部' ? undefined : assigneeFilter);
    addGearToTrip(trip.id, gearId, a);
  };

  const assigneeCounts: Record<AssigneeFilter, number> = {
    全部: trip.gearList.length,
    我: trip.gearList.filter(tg => (tg.assignee ?? '我') === '我').length,
    公共: trip.gearList.filter(tg => tg.assignee === '公共').length,
    队友: trip.gearList.filter(tg => tg.assignee === '队友').length,
  };

  return (
    <div className="page">
      <div className="mb-4 print:hidden">
        <Link to="/trips" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent transition-colors">
          <ArrowLeft size={14} /> 返回行程列表
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold">{trip.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
            <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{trip.location}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar size={15} />{trip.startDate} ~ {trip.endDate}</span>
            {trip.distance && <span className="inline-flex items-center gap-1.5"><Ruler size={15} />{trip.distance}km</span>}
            {trip.elevation && <span className="inline-flex items-center gap-1.5"><Mountain size={15} />{trip.elevation}m</span>}
            {trip.members.length > 0 && <span className="inline-flex items-center gap-1.5"><Users size={15} />{trip.members.join(', ')}</span>}
          </div>
          {trip.route && (
            <div className="mt-3 px-4 py-3 bg-accent-light rounded-2xl text-sm flex items-center gap-2">
              <MapIcon size={15} className="text-accent shrink-0" />
              {trip.route}
            </div>
          )}
          {trip.trackUrl && (
            <div className="mt-2 px-4 py-3 bg-blue-light rounded-2xl text-sm flex items-center gap-2">
              <Download size={14} className="text-blue shrink-0" />
              <a href={trip.trackUrl} target="_blank" rel="noopener noreferrer" className="text-blue hover:underline break-all">
                下载轨迹
              </a>
            </div>
          )}
        </div>

        <div className="print:hidden flex flex-wrap items-center gap-2 shrink-0 relative">
          <button
            className={`text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              trip.status === 'planned'
                ? 'bg-amber-light text-amber hover:bg-amber/20'
                : 'bg-accent-light text-accent hover:bg-accent/20'
            }`}
            onClick={toggleStatus}
            title="点击切换状态"
          >
            {trip.status === 'planned' ? '待出发' : '已完成'}
          </button>
          <Link to={`/trips/${trip.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-100 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-all active:scale-95">
            <Edit3 size={14} />
            编辑
          </Link>
          <div className="relative">
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-100 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <FileDown size={14} />
              导出
            </button>
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-full mt-2 bg-surface rounded-2xl border border-slate-100 shadow-lg z-50 min-w-[180px] overflow-hidden">
                  <button
                    className="w-full px-4 py-3 text-sm text-left hover:bg-accent-light/30 flex items-center gap-2 transition-all border-b border-slate-100 cursor-pointer"
                    onClick={() => { window.print(); setShowExportMenu(false); }}
                  >
                    <Printer size={14} />
                    打印 / PDF
                  </button>
                  <button
                    className="w-full px-4 py-3 text-sm text-left hover:bg-accent-light/30 flex items-center gap-2 transition-all cursor-pointer"
                    onClick={() => handleCopySummary(setCopied)}
                  >
                    <ClipboardList size={14} />
                    {copied ? '已复制!' : '复制文字摘要'}
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-100 rounded-2xl text-sm font-medium text-red hover:bg-red-light transition-all active:scale-95 cursor-pointer"
            onClick={() => {
              if (window.confirm(`确定删除行程「${trip.title}」吗？此操作不可恢复。`)) {
                deleteTrip(trip.id);
                navigate('/trips');
              }
            }}
          >
            <Trash2 size={14} />
            删除
          </button>
        </div>
      </div>

      {riskEntries.length > 0 && (
        <section className="mt-6 rounded-3xl border border-amber-light bg-amber-light/20 p-5">
          <h2 className="font-extrabold text-lg flex items-center gap-2 mb-4">
            <ShieldAlert size={20} className="text-amber" />
            出发前风险信息
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {riskEntries.map(([label, value]) => (
              <div key={label} className="bg-surface/80 border border-white rounded-2xl px-4 py-3">
                <div className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-1">{label}</div>
                <div className="text-sm whitespace-pre-wrap">{value}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {trip.plan && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4 print:hidden">
            <h2 className="font-extrabold text-lg flex items-center gap-2">📋 行程计划</h2>
            <button
              className="px-4 py-2 border border-slate-100 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
              onClick={() => setShowPlan(!showPlan)}
            >
              {showPlan ? '收起' : '展开'}
            </button>
          </div>
          <div className={`rounded-3xl border border-slate-100 overflow-hidden print:hidden ${showPlan ? '' : 'hidden'}`}>
            <iframe className="w-full h-[520px] border-none block" srcDoc={planDoc} sandbox="" title="行程计划" />
          </div>
          <div className="hidden print:block mt-8">
            <h2 className="font-extrabold text-lg border-b-2 border-accent-light pb-2 mb-4">📋 行程计划</h2>
            <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizedPlan }} />
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h2 className="font-extrabold text-lg flex items-center gap-2">
            <Backpack size={22} className="text-accent" />
            打包清单
            <span className="text-sm font-normal text-slate-500">({packedCount}/{totalCount})</span>
          </h2>
          <button
            className="print:hidden inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-100 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowAddGear(true)}
            disabled={gearItems.length === 0}
          >
            <Plus size={14} />
            添加装备
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard label="总重量" value={formatWeight(allStats.totalWeight)} />
          <StatCard label="已打包" value={formatWeight(allStats.packedWeight)} />
          <StatCard label="未打包" value={formatWeight(allStats.totalWeight - allStats.packedWeight)} />
          <StatCard label="完成度" value={`${packedPercent}%`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
          <WeightBreakdown title="按分类重量" entries={byCategory} />
          <WeightBreakdown title="按负责人重量" entries={byAssignee} />
        </div>

        <div className="print:hidden flex gap-2 flex-wrap mb-4">
          {(['全部', ...ASSIGNEES] as const).map(a => (
            <button
              key={a}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all active:scale-95 cursor-pointer ${
                assigneeFilter === a
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'border-slate-100 bg-surface text-slate-600 hover:bg-accent-light hover:text-accent'
              }`}
              onClick={() => setAssigneeFilter(a)}
            >
              {a} <span className="text-xs ml-0.5 opacity-70">{assigneeCounts[a]}</span>
            </button>
          ))}
        </div>

        {totalCount === 0 && (
          <div className="py-12 text-center text-slate-500">
            <p>还没有装备，点击「添加装备」从装备库导入</p>
            {gearItems.length === 0 && (
              <p className="text-sm mt-1">
                装备库也没有，先去 <Link to="/gear" className="text-accent hover:underline">装备库</Link> 录入吧
              </p>
            )}
          </div>
        )}

        {filteredStats.count > 0 && assigneeFilter !== '全部' && (
          <p className="text-xs text-slate-500 mb-3">
            当前负责人重量：<span className="font-extrabold text-accent">{formatWeight(filteredStats.totalWeight)}</span>
          </p>
        )}

        {Object.entries(groupedGear).map(([cat, items]) => (
          <div key={cat} className="mb-4 break-inside-avoid">
            <h3 className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-2 mt-4 first:mt-0">{cat}</h3>
            {items.map(item => (
              <div key={item.gearId} className="group flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50/50 transition-all break-inside-avoid">
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.packed}
                    onChange={() => togglePacked(trip.id, item.gearId)}
                    className="w-4 h-4 rounded accent-accent cursor-pointer print:hidden"
                  />
                  <span className={`text-sm flex-1 ${item.packed ? 'line-through text-slate-400 print:no-underline print:text-inherit' : ''}`}>
                    {item.name}
                    <span className="text-xs text-slate-400 ml-2">×{item.quantity} · {formatWeight(item.weight)}</span>
                  </span>
                </label>
                {item.assignee && assigneeFilter === '全部' && (
                  <AssigneeBadge assignee={item.assignee} />
                )}
                <button
                  className="print:hidden opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-light text-red cursor-pointer"
                  title="移除此装备"
                  onClick={() => removeGearFromTrip(trip.id, item.gearId)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="font-extrabold text-lg border-b-2 border-accent-light pb-2 mb-4">📝 游记</h2>
        {trip.journal && !editingJournal ? (
          <div>
            {trip.rating && (
              <div className="flex gap-1 mb-3 text-amber">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} size={22} className={n <= trip.rating! ? 'fill-amber text-amber' : 'text-slate-200'} />
                ))}
              </div>
            )}
            <div className="whitespace-pre-wrap text-sm leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
              {trip.journal}
            </div>
            <button
              className="print:hidden mt-3 px-4 py-2 border border-slate-100 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
              onClick={() => { setJournalText(trip.journal ?? ''); setRating(trip.rating ?? 0); setEditingJournal(true); }}
            >
              编辑
            </button>
          </div>
        ) : editingJournal ? (
          <div className="space-y-4 print:hidden">
            <div>
              <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">评分</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setRating(n)}
                    className="cursor-pointer transition-all active:scale-90">
                    <Star size={24} className={n <= rating ? 'fill-amber text-amber' : 'text-slate-200 hover:text-amber/50'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">记录</label>
              <textarea
                rows={6}
                value={journalText}
                onChange={e => setJournalText(e.target.value)}
                placeholder="天气、路况、印象深刻的事、感受…"
                className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface resize-y"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-5 py-2.5 border border-slate-100 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                onClick={() => setEditingJournal(false)}
              >
                取消
              </button>
              <button
                className="px-5 py-2.5 bg-accent text-white rounded-2xl text-sm font-semibold hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer"
                onClick={handleSaveJournal}
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <div className="print:hidden">
            <p className="text-sm text-slate-500 mb-3">还没有记录</p>
            <button
              className="px-5 py-2.5 bg-accent text-white rounded-2xl text-sm font-semibold hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer"
              onClick={() => setEditingJournal(true)}
            >
              写游记
            </button>
          </div>
        )}
      </section>

      {showAddGear && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setShowAddGear(false)}>
          <div className="bg-surface rounded-3xl p-5 sm:p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-extrabold mb-6">添加装备</h2>
            {availableGear.length === 0 ? (
              <p className="text-sm text-slate-500">装备库没有可添加的装备了</p>
            ) : (
              <>
                <div className="flex gap-2 flex-wrap mb-4">
                  <button
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95 cursor-pointer ${
                      addFilter === 'all'
                        ? 'bg-accent text-white border-accent shadow-sm'
                        : 'border-slate-100 bg-surface text-slate-600 hover:bg-accent-light hover:text-accent'
                    }`}
                    onClick={() => setAddFilter('all')}
                  >
                    全部 <span className="font-extrabold ml-1">{availableGear.length}</span>
                  </button>
                  {GEAR_CATEGORIES.map(cat => {
                    const count = availableGear.filter(g => g.category === cat.value).length;
                    if (!count) return null;
                    return (
                      <button key={cat.value}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95 cursor-pointer ${
                          addFilter === cat.value
                            ? 'bg-accent text-white border-accent shadow-sm'
                            : 'border-slate-100 bg-surface text-slate-600 hover:bg-accent-light hover:text-accent'
                        }`}
                        onClick={() => setAddFilter(cat.value)}>
                        {cat.label} <span className="font-extrabold ml-1">{count}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredAvailable.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <button
                        className="flex-1 inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-100 text-sm text-left transition-all hover:border-accent hover:bg-accent-light/30 active:scale-[0.98] cursor-pointer"
                        onClick={() => handleAddGear(item.id)}
                      >
                        <Plus size={14} className="text-accent shrink-0" />
                        <span className="flex-1 font-medium">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{gearCategoryLabel(item.category)}</span>
                      </button>
                      <select
                        className="px-3 py-2.5 rounded-xl border border-slate-100 text-xs cursor-pointer bg-surface"
                        value={assigneeFilter === '全部' ? '我' : assigneeFilter}
                        onChange={e => handleAddGear(item.id, e.target.value as Assignee)}
                        onClick={e => e.stopPropagation()}
                      >
                        {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="flex items-center justify-end mt-6">
              <button
                className="px-5 py-2.5 border border-slate-100 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                onClick={() => setShowAddGear(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface border border-slate-100 px-4 py-3">
      <div className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-1">{label}</div>
      <div className="text-lg font-extrabold text-accent">{value}</div>
    </div>
  );
}

function WeightBreakdown({ title, entries }: { title: string; entries: Record<string, number> }) {
  return (
    <div className="rounded-2xl bg-surface border border-slate-100 p-4">
      <div className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-2 flex items-center gap-1.5">
        <Scale size={12} />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(entries).length > 0 ? Object.entries(entries).map(([label, weight]) => (
          <span key={label} className="px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold">
            {label} {formatWeight(weight)}
          </span>
        )) : (
          <span className="text-xs text-slate-400">暂无重量数据</span>
        )}
      </div>
    </div>
  );
}

function AssigneeBadge({ assignee }: { assignee: Assignee }) {
  return (
    <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
      assignee === '我' ? 'bg-accent-light text-accent' :
      assignee === '公共' ? 'bg-amber-light text-amber' :
      'bg-blue-light text-blue'
    }`}>
      {assignee}
    </span>
  );
}

function gearWeight(gear: GearItem): number {
  return (gear.weight ?? 0) * gear.quantity;
}

function summarizeGear(list: TripGear[], gearMap: Map<string, GearItem>) {
  return list.reduce((acc, tg) => {
    const gear = gearMap.get(tg.gearId);
    if (!gear) return acc;
    const weight = gearWeight(gear);
    acc.count += 1;
    acc.totalWeight += weight;
    if (tg.packed) {
      acc.packedCount += 1;
      acc.packedWeight += weight;
    }
    return acc;
  }, { count: 0, packedCount: 0, totalWeight: 0, packedWeight: 0 });
}

function summarizeByCategory(list: TripGear[], gearMap: Map<string, GearItem>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const tg of list) {
    const gear = gearMap.get(tg.gearId);
    if (!gear) continue;
    const label = gearCategoryLabel(gear.category);
    result[label] = (result[label] ?? 0) + gearWeight(gear);
  }
  return removeZeroEntries(result);
}

function summarizeByAssignee(list: TripGear[], gearMap: Map<string, GearItem>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const tg of list) {
    const gear = gearMap.get(tg.gearId);
    if (!gear) continue;
    const label = tg.assignee ?? '我';
    result[label] = (result[label] ?? 0) + gearWeight(gear);
  }
  return removeZeroEntries(result);
}

function removeZeroEntries(entries: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(entries).filter(([, value]) => value > 0));
}

function formatWeight(grams: number): string {
  if (grams <= 0) return '未录入';
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)}kg`;
  return `${Math.round(grams)}g`;
}

function riskInfoEntries(trip: Trip): [string, string][] {
  const info = trip.riskInfo;
  if (!info) return [];
  return [
    ['天气', info.weather],
    ['补给', info.supply],
    ['交通', info.transport],
    ['紧急联系人', info.emergency],
    ['注意事项', info.notes],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
}

function buildSummaryText(trip: Trip, gearItems: GearItem[], sanitizedPlan: string, stats: ReturnType<typeof summarizeGear>): string {
  const gearById = new Map(gearItems.map(g => [g.id, g]));
  const lines: string[] = [];
  lines.push(`🏔️ ${trip.title}`);
  lines.push(`📍 ${trip.location}  |  📅 ${trip.startDate} ~ ${trip.endDate}`);
  if (trip.route) lines.push(`🗺️ ${trip.route}`);
  if (trip.distance || trip.elevation || trip.members.length) {
    const parts: string[] = [];
    if (trip.distance) parts.push(`📏 ${trip.distance}km`);
    if (trip.elevation) parts.push(`🏔️ ${trip.elevation}m`);
    if (trip.members.length) parts.push(`👥 ${trip.members.join(', ')}`);
    lines.push(parts.join('  |  '));
  }
  lines.push(`🎒 装备重量 ${formatWeight(stats.totalWeight)}，已打包 ${formatWeight(stats.packedWeight)}`);
  lines.push('');

  const riskEntries = riskInfoEntries(trip);
  if (riskEntries.length > 0) {
    lines.push('━'.repeat(20));
    lines.push('⚠️ 出发前风险信息');
    lines.push('━'.repeat(20));
    for (const [label, value] of riskEntries) lines.push(`${label}: ${value}`);
    lines.push('');
  }

  if (sanitizedPlan) {
    lines.push('━'.repeat(20));
    lines.push('📋 行程计划');
    lines.push('━'.repeat(20));
    lines.push(stripHtml(sanitizedPlan).trim());
    lines.push('');
  }

  if (trip.gearList.length > 0) {
    lines.push('━'.repeat(20));
    lines.push('🎒 打包清单');
    lines.push('━'.repeat(20));
    const catGroups: Record<string, string[]> = {};
    for (const tg of trip.gearList) {
      const g = gearById.get(tg.gearId);
      if (!g) continue;
      const cat = gearCategoryLabel(g.category);
      if (!catGroups[cat]) catGroups[cat] = [];
      const mark = tg.packed ? '✅' : '⬜';
      const who = tg.assignee ? ` (${tg.assignee})` : '';
      catGroups[cat].push(`  ${mark} ${g.name} ×${g.quantity} ${formatWeight(gearWeight(g))}${who}`);
    }
    for (const [cat, items] of Object.entries(catGroups)) {
      lines.push(`\n${cat}`);
      lines.push(...items);
    }
    lines.push('');
  }

  if (trip.journal) {
    lines.push('━'.repeat(20));
    lines.push('📝 游记');
    lines.push('━'.repeat(20));
    lines.push(trip.journal);
  }

  return lines.join('\n');
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

function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, iframe, object, embed, link, meta').forEach(node => node.remove());
  doc.body.querySelectorAll('*').forEach(node => {
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      if (name.startsWith('on') || ((name === 'href' || name === 'src') && value.startsWith('javascript:'))) {
        node.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.innerHTML;
}

function wrapPlanHtml(fragment: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;background:#f7f5f0;font-family:-apple-system,'PingFang SC','Noto Sans SC','Microsoft YaHei',sans-serif;line-height:1.6;color:#2c2c2c;}</style>
</head><body style="padding:16px;">${fragment}</body></html>`;
}
