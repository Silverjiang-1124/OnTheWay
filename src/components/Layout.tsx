import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Backpack, Map, Mountain } from 'lucide-react';

const links = [
  { to: '/', label: '首页', icon: LayoutDashboard },
  { to: '/gear', label: '装备库', icon: Backpack },
  { to: '/trips', label: '行程', icon: Map },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg text-slate-900">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-sidebar h-screen sticky top-0 p-6 gap-8">
        <div className="px-2">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-emerald-500 p-1.5 rounded-xl shadow-lg shadow-emerald-950/30">
              <Mountain size={24} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-[22px] tracking-tight">OnTheWay</span>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-950/25'
                    : 'text-sidebar-text hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-around h-16 bg-white border-t border-slate-100 px-2 shadow-[0_-12px_30px_rgba(15,23,42,0.08)]">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'
              }`
            }
          >
            <link.icon size={20} />
            <span className="text-[10px] font-black tracking-wider uppercase">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 p-4 pb-24 md:pb-10 md:p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
