import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { Map, Plus, MapPin, Calendar, Ruler, Mountain, Users, Trophy, ArrowRight } from 'lucide-react';

export default function TripList() {
  const { trips } = useStore();

  const planned = trips.filter(t => t.status === 'planned').sort((a, b) => a.startDate.localeCompare(b.startDate));
  const completed = trips.filter(t => t.status === 'completed').sort((a, b) => b.startDate.localeCompare(a.startDate));

  const TripCard = (trip: typeof trips[number]) => {
    const packed = trip.gearList.filter(g => g.packed).length;
    const total = trip.gearList.length;
    return (
      <Link to={`/trips/${trip.id}`} className="block mb-4" key={trip.id}>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all active:scale-[0.99] overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-slate-900 p-7 text-white flex flex-col justify-between min-h-[190px] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-emerald-500/20" />
            <div className="relative">
              <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-1 rounded ${
                trip.status === 'planned' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {trip.status === 'planned' ? 'Upcoming' : 'Completed'}
              </span>
              <h3 className="text-2xl font-extrabold mt-3 leading-tight">{trip.title}</h3>
            </div>
            <div className="relative flex items-center gap-2 text-slate-300 text-sm">
              <Calendar size={14} />
              <span>{trip.startDate} ~ {trip.endDate}</span>
            </div>
          </div>
          <div className="flex-1 p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">地点</p>
                <p className="font-bold flex items-center gap-2 text-slate-800">
                  <MapPin size={16} className="text-emerald-500" />
                  {trip.location}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">技术参数</p>
                <p className="font-bold flex items-center gap-3 text-slate-800">
                  {trip.distance && <span className="inline-flex items-center gap-1"><Ruler size={16} className="text-emerald-500" />{trip.distance}km</span>}
                  {trip.elevation && <span className="inline-flex items-center gap-1"><Trophy size={16} className="text-amber-500" />{trip.elevation}m</span>}
                  {!trip.distance && !trip.elevation && <span className="inline-flex items-center gap-1"><Mountain size={16} className="text-emerald-500" />待补充</span>}
                </p>
              </div>
            </div>

            <div className="mb-7">
              <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Users size={13} />
                  同行队友
                </p>
                <span className="text-xs text-emerald-600 font-bold">{trip.members.length} 人</span>
              </div>
              <div className="flex -space-x-2">
                {trip.members.length ? trip.members.slice(0, 5).map((m, i) => (
                  <span key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-slate-600 ring-1 ring-slate-100">
                    {m.charAt(0)}
                  </span>
                )) : (
                  <span className="text-sm text-slate-400">未填写队友</span>
                )}
                {trip.members.length > 5 && (
                  <span className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-white">
                    +{trip.members.length - 5}
                  </span>
                )}
              </div>
            </div>

            {total > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-400 uppercase tracking-wider">装备打包进度</span>
                    <span className="text-emerald-600">{packed}/{total}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(packed / total) * 100}%` }} />
                  </div>
                </div>
                <span className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-black transition-colors shadow-lg">
                  <ArrowRight size={20} />
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="page">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-black tracking-[0.24em] uppercase text-emerald-600 mb-2">Itinerary</p>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <Map size={28} className="text-accent" />
            行程计划
          </h1>
          <p className="text-slate-500 mt-2">精心策划，享受每一次出发。</p>
        </div>
        <Link to="/trips/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-2xl font-semibold text-sm shadow-sm hover:shadow-lg transition-all active:scale-95">
          <Plus size={16} />
          新行程
        </Link>
      </div>

      {trips.length === 0 && (
        <div className="py-20 text-center text-slate-500">
          <p>还没有行程，创建一个吧</p>
        </div>
      )}

      {planned.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
            待出发
            <span className="text-sm font-normal text-slate-500">({planned.length})</span>
          </h2>
          {planned.map(TripCard)}
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
            已完成
            <span className="text-sm font-normal text-slate-500">({completed.length})</span>
          </h2>
          {completed.map(TripCard)}
        </section>
      )}
    </div>
  );
}
