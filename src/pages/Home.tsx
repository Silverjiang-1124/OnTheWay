import { useStore } from '../store/useStore';
import { gearCategoryLabel, type GearCategory } from '../types';
import { Link } from 'react-router-dom';
import { Package, CalendarCheck, CheckCircle2, MapPin, Calendar, Mountain, Download, Upload, ChevronRight, Layers, ArrowRight } from 'lucide-react';


export default function Home() {
  const { gearItems, trips, exportBackup, importBackup } = useStore();

  const upcoming = trips.filter(t => t.status === 'planned').sort((a, b) => a.startDate.localeCompare(b.startDate));
  const completed = trips.filter(t => t.status === 'completed');
  const byCategory = gearItems.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {} as Partial<Record<GearCategory, number>>);

  const handleExport = () => {
    const backup = exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ontheway-backup-${backup.exportedAt.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      file.text().then(text => {
        if (!window.confirm('导入会按 ID 合并备份数据；同 ID 数据会以备份为准。确认导入？')) return;
        const result = importBackup(JSON.parse(text));
        window.alert(`导入完成：装备 ${result.gearCount} 条，行程 ${result.tripCount} 条。`);
      }).catch(() => {
        window.alert('导入失败：请确认文件是 OnTheWay JSON 备份。');
      });
    };
    input.click();
  };

  return (
    <div className="page">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-black tracking-[0.24em] uppercase text-emerald-600 mb-2">Outdoor Command Center</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">发现新征程</h1>
          <p className="text-slate-500 mt-2">欢迎回来，先确认装备和行程，再安心出发。</p>
        </div>
        <Link
          to="/trips/new"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-200 active:scale-95 font-semibold"
        >
          新建行程
          <ArrowRight size={18} />
        </Link>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-6">
        <Link to="/gear" className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 active:scale-[0.98] flex items-center gap-5">
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl">
            <Package size={28} />
          </div>
          <span>
            <span className="text-sm text-slate-500 font-medium block">装备总数</span>
            <span className="text-3xl font-extrabold text-slate-900 block">{gearItems.length}</span>
          </span>
        </Link>
        <Link to="/trips" className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 active:scale-[0.98] flex items-center gap-5">
          <div className="bg-amber-50 text-amber-600 p-4 rounded-2xl">
            <CalendarCheck size={28} />
          </div>
          <span>
            <span className="text-sm text-slate-500 font-medium block">待出发</span>
            <span className="text-3xl font-extrabold text-slate-900 block">{upcoming.length}</span>
          </span>
        </Link>
        <Link to="/trips" className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 active:scale-[0.98] flex items-center gap-5">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
            <CheckCircle2 size={28} />
          </div>
          <span>
            <span className="text-sm text-slate-500 font-medium block">已完成</span>
            <span className="text-3xl font-extrabold text-slate-900 block">{completed.length}</span>
          </span>
        </Link>
      </div>

      {/* Upcoming trips */}
      {upcoming.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-xl flex items-center gap-2">
              <CalendarCheck className="text-emerald-600" size={20} />
              即将出发
            </h2>
            <Link to="/trips" className="text-emerald-600 text-sm font-semibold inline-flex items-center gap-1 hover:underline">
              查看全部行程 <ChevronRight size={16} />
            </Link>
          </div>
          {upcoming.map(trip => (
            <Link to={`/trips/${trip.id}`} key={trip.id} className="block mb-3">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-6 active:scale-[0.99] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-800 mb-2">{trip.title}</h3>
                      <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
                        <span className="inline-flex items-center gap-1.5"><MapPin size={16} className="text-emerald-500" />{trip.location}</span>
                        <span className="inline-flex items-center gap-1.5"><Calendar size={16} className="text-emerald-500" />{trip.startDate} ~ {trip.endDate}</span>
                        {(trip.distance || trip.elevation) && (
                          <span className="inline-flex items-center gap-1.5">
                            <Layers size={16} className="text-emerald-500" />
                            {trip.distance ? `${trip.distance}km` : '-'} / {trip.elevation ? `${trip.elevation}m` : '-'}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                      进行中
                    </span>
                  </div>
                  <div className="mt-8 flex items-center gap-5">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-400 uppercase tracking-wider">装备打包进度</span>
                        <span className="text-emerald-600">{trip.gearList.filter(g => g.packed).length}/{trip.gearList.length}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: trip.gearList.length ? `${(trip.gearList.filter(g => g.packed).length / trip.gearList.length) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                    <span className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg group-hover:bg-black transition-colors">
                      <ArrowRight size={20} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Gear overview */}
      {gearItems.length > 0 && (
        <section className="mt-8">
          <h2 className="font-extrabold text-xl mb-5 flex items-center gap-2">
            <Package className="text-emerald-600" size={20} />
            装备分类预览
          </h2>
          <div className="flex gap-3 flex-wrap">
            {(Object.entries(byCategory) as [GearCategory, number][]).map(([cat, count]) => (
              <span key={cat} className="inline-flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {gearCategoryLabel(cat)} <strong className="font-extrabold">{count}</strong>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-extrabold text-lg flex items-center gap-2 pb-2 border-b-2 border-accent-light mb-4">
          数据备份
        </h2>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm text-slate-500 flex-1">
            数据保存在当前浏览器 localStorage。出发前建议导出 JSON 备份，换设备或清空浏览器后可再导入恢复。
          </p>
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-100 rounded-2xl text-sm font-semibold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            onClick={handleImport}
          >
            <Upload size={16} />
            导入备份
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-white rounded-2xl text-sm font-semibold shadow-sm hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            onClick={handleExport}
          >
            <Download size={16} />
            导出备份
          </button>
        </div>
      </section>

      {/* Empty state */}
      {trips.length === 0 && gearItems.length === 0 && (
        <div className="py-20 text-center text-slate-500">
          <Mountain size={48} className="mx-auto mb-4 text-slate-300" />
          <p>欢迎使用 OnTheWay</p>
          <p className="text-sm mt-2">
            先去 <Link to="/gear" className="text-accent hover:underline">装备库</Link> 添加你的装备，再创建行程吧
          </p>
        </div>
      )}
    </div>
  );
}
