import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export default function TripList() {
  const { trips } = useStore();

  const planned = trips.filter(t => t.status === 'planned').sort((a, b) => a.startDate.localeCompare(b.startDate));
  const completed = trips.filter(t => t.status === 'completed').sort((a, b) => b.startDate.localeCompare(a.startDate));

  const TripCard = (trip: typeof trips[number]) => {
    const packed = trip.gearList.filter(g => g.packed).length;
    const total = trip.gearList.length;
    return (
      <Link to={`/trips/${trip.id}`} className="card-link" key={trip.id}>
        <div className="trip-card">
          <div className="trip-card-top">
            <span className="trip-title">{trip.title}</span>
            <span className={`status-badge ${trip.status}`}>
              {trip.status === 'planned' ? '待出发' : '已完成'}
            </span>
          </div>
          <div className="trip-card-meta">
            <span>📍 {trip.location}</span>
            <span>📅 {trip.startDate} ~ {trip.endDate}</span>
          </div>
          {trip.distance && <div className="trip-card-meta"><span>📏 {trip.distance}km{trip.elevation ? ` · 🏔️ ${trip.elevation}m爬升` : ''}</span></div>}
          {total > 0 && (
            <div className="packing-bar-wrap">
              <div className="packing-bar">
                <div className="packing-fill" style={{ width: `${(packed / total) * 100}%` }} />
              </div>
              <span className="packing-text">{packed}/{total} 已打包</span>
            </div>
          )}
          {trip.members.length > 0 && (
            <div className="trip-members">👥 {trip.members.join(', ')}</div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">行程</h1>
        <Link to="/trips/new" className="btn btn-primary">+ 新行程</Link>
      </div>

      {trips.length === 0 && (
        <div className="empty-state">
          <p>还没有行程，创建一个吧</p>
        </div>
      )}

      {planned.length > 0 && (
        <section className="section">
          <h2 className="section-title">待出发 ({planned.length})</h2>
          {planned.map(TripCard)}
        </section>
      )}

      {completed.length > 0 && (
        <section className="section">
          <h2 className="section-title">已完成 ({completed.length})</h2>
          {completed.map(TripCard)}
        </section>
      )}
    </div>
  );
}
