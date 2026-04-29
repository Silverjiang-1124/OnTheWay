import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Backpack, Map, Mountain } from 'lucide-react';

const links = [
  { to: '/', label: '首页', icon: LayoutDashboard },
  { to: '/gear', label: '装备库', icon: Backpack },
  { to: '/trips', label: '行程', icon: Map },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-sidebar h-screen sticky top-0">
        <div className="px-6 py-8 border-b border-white/10">
          <div className="flex items-center gap-3 text-white">
            <Mountain size={24} />
            <span className="font-extrabold text-lg">OnTheWay</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3 mt-6">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-text transition-all ${
                  isActive ? 'bg-white/10 text-sidebar-active font-semibold' : 'hover:bg-white/5'
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-around h-16 bg-sidebar border-t border-white/10 px-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-sidebar-active' : 'text-sidebar-text'
              }`
            }
          >
            <link.icon size={20} />
            <span className="text-[10px] font-black tracking-wider uppercase">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 pb-24 md:pb-8 md:p-10 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
