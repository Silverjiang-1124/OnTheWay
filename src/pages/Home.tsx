import { useStore } from '../store/useStore';
import { gearCategoryLabel, type GearCategory } from '../types';
import { Link } from 'react-router-dom';
import { Package, CalendarCheck, CheckCircle2, MapPin, Calendar, Mountain, Download, Upload } from 'lucide-react';


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
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <Link to="/gear" className="bg-surface rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-6 text-center active:scale-[0.98] block">
          <Package size={32} className="text-accent mx-auto mb-2" />
          <span className="text-3xl font-extrabold text-accent block">{gearItems.length}</span>
          <span className="text-sm text-slate-500 mt-1 block">装备总数</span>
        </Link>
        <Link to="/trips" className="bg-surface rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-6 text-center active:scale-[0.98] block">
          <CalendarCheck size={32} className="text-amber mx-auto mb-2" />
          <span className="text-3xl font-extrabold text-amber block">{upcoming.length}</span>
          <span className="text-sm text-slate-500 mt-1 block">待出发</span>
        </Link>
        <Link to="/trips" className="bg-surface rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-6 text-center active:scale-[0.98] block">
          <CheckCircle2 size={32} className="text-blue mx-auto mb-2" />
          <span className="text-3xl font-extrabold text-blue block">{completed.length}</span>
          <span className="text-sm text-slate-500 mt-1 block">已完成</span>
        </Link>
      </div>

      {/* Upcoming trips */}
      {upcoming.length > 0 && (
        <section className="mt-8">
          <h2 className="font-extrabold text-lg flex items-center gap-2 pb-2 border-b-2 border-accent-light mb-4">
            即将出发
          </h2>
          {upcoming.map(trip => (
            <Link to={`/trips/${trip.id}`} key={trip.id} className="block mb-3">
              <div className="bg-surface rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-5 active:scale-[0.99]">
                <div className="font-extrabold text-accent">{trip.title}</div>
                <div className="flex gap-4 text-sm text-slate-500 mt-1.5">
                  <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{trip.location}</span>
                  <span className="inline-flex items-center gap-1.5"><Calendar size={14} />{trip.startDate} ~ {trip.endDate}</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Gear overview */}
      {gearItems.length > 0 && (
        <section className="mt-8">
          <h2 className="font-extrabold text-lg flex items-center gap-2 pb-2 border-b-2 border-accent-light mb-4">
            装备概览
          </h2>
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(byCategory) as [GearCategory, number][]).map(([cat, count]) => (
              <span key={cat} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-light text-accent text-sm font-medium">
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
        <div className="bg-surface rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-3">
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
