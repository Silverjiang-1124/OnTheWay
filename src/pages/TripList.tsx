import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { Map, Plus, MapPin, Calendar, Ruler, Mountain, Users } from 'lucide-react';

export default function TripList() {
  const { trips } = useStore();

  const planned = trips.filter(t => t.status === 'planned').sort((a, b) => a.startDate.localeCompare(b.startDate));
  const completed = trips.filter(t => t.status === 'completed').sort((a, b) => b.startDate.localeCompare(a.startDate));

  const TripCard = (trip: typeof trips[number]) => {
    const packed = trip.gearList.filter(g => g.packed).length;
    const total = trip.gearList.length;
    return (
      <Link to={`/trips/${trip.id}`} className="block mb-4" key={trip.id}>
        <div className="bg-surface rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-6 active:scale-[0.99]">
          <div className="flex items-start justify-between mb-3">
            <span className="font-extrabold text-base text-accent">{trip.title}</span>
            <span className={`text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-full ${
              trip.status === 'planned'
                ? 'bg-amber-light text-amber'
                : 'bg-accent-light text-accent'
            }`}>
              {trip.status === 'planned' ? '待出发' : '已完成'}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-2">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{trip.location}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar size={14} />{trip.startDate} ~ {trip.endDate}</span>
          </div>
          {(trip.distance || trip.elevation) && (
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
              {trip.distance && <span className="inline-flex items-center gap-1.5"><Ruler size={14} />{trip.distance}km</span>}
              {trip.elevation && <span className="inline-flex items-center gap-1.5"><Mountain size={14} />{trip.elevation}m 爬升</span>}
            </div>
          )}
          {total > 0 && (
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(packed / total) * 100}%` }} />
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">{packed}/{total} 已打包</span>
            </div>
          )}
          {trip.members.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-slate-400" />
              <div className="flex -space-x-2">
                {trip.members.slice(0, 4).map((m, i) => (
                  <span key={i} className="w-7 h-7 rounded-full bg-accent-light border-2 border-surface flex items-center justify-center text-xs font-extrabold text-accent">
                    {m.charAt(0)}
                  </span>
                ))}
                {trip.members.length > 4 && (
                  <span className="w-7 h-7 rounded-full bg-slate-100 border-2 border-surface flex items-center justify-center text-[10px] font-extrabold text-slate-500">
                    +{trip.members.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Map size={24} className="text-accent" />
          行程
        </h1>
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
