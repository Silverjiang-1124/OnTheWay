import { useStore } from '../store/useStore';
import { gearCategoryLabel } from '../types';
import { Link } from 'react-router-dom';

export default function Home() {
  const { gearItems, trips } = useStore();

  const upcoming = trips.filter(t => t.status === 'planned').sort((a, b) => a.startDate.localeCompare(b.startDate));
  const completed = trips.filter(t => t.status === 'completed');
  const byCategory = gearItems.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="page">
      <h1 className="page-title">首页</h1>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-num">{gearItems.length}</span>
          <span className="stat-label">装备总数</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{upcoming.length}</span>
          <span className="stat-label">待出发</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{completed.length}</span>
          <span className="stat-label">已完成</span>
        </div>
      </div>

      {upcoming.length > 0 && (
        <section className="section">
          <h2 className="section-title">即将出发</h2>
          {upcoming.map(trip => (
            <Link to={`/trips/${trip.id}`} key={trip.id} className="card-link">
              <div className="trip-mini-card">
                <div>
                  <strong>{trip.title}</strong>
                  <span className="text-muted" style={{ marginLeft: 12 }}>{trip.location}</span>
                </div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  {trip.startDate} ~ {trip.endDate}
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {gearItems.length > 0 && (
        <section className="section">
          <h2 className="section-title">装备概览</h2>
          <div className="cat-chips">
            {Object.entries(byCategory).map(([cat, count]) => (
              <span key={cat} className="chip">
                {gearCategoryLabel(cat as any)} <strong>{count}</strong>
              </span>
            ))}
          </div>
        </section>
      )}

      {trips.length === 0 && gearItems.length === 0 && (
        <div className="empty-state">
          <p>欢迎使用 OnTheWay 🏔️</p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>
            先去 <Link to="/gear">装备库</Link> 添加你的装备，再创建行程吧
          </p>
        </div>
      )}
    </div>
  );
}
