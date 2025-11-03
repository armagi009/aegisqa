import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, GitPullRequest, Settings, LifeBuoy, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';
const navItems = [
  { href: '/', icon: Workflow, label: 'Ingestion Layer' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pull-requests', icon: GitPullRequest, label: 'Pull Requests' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];
export function AegisSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground sm:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <Shield className="h-8 w-8 text-primary-foreground" />
        <span className="text-xl font-bold font-display text-primary-foreground">AegisQA</span>
      </div>
      <nav className="flex flex-col flex-1 gap-y-4 p-4">
        <ul className="flex flex-col gap-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : ''
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <NavLink
            to="/support"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LifeBuoy className="h-4 w-4" />
            Support
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}