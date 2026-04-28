import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: '首页', icon: '🏠' },
  { to: '/gear', label: '装备库', icon: '🎒' },
  { to: '/trips', label: '行程', icon: '🗺️' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🏔️</span>
          <span className="brand-text">OnTheWay</span>
        </div>
        <nav className="sidebar-nav">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
