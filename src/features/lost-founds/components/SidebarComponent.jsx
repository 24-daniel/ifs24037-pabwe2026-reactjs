import { Link, useLocation } from "react-router-dom";
import { IconLayoutDashboard, IconChartBar, IconUsers, IconUser } from "@tabler/icons-react";

const items = [
  { to: "/", label: "Dashboard", icon: IconLayoutDashboard },
  { to: "/#statistik", label: "Statistik", icon: IconChartBar },
  { to: "/users", label: "Pengguna", icon: IconUsers },
  { to: "/profile", label: "Profil Saya", icon: IconUser },
];

export default function SidebarComponent({ open, onClose }) {
  const { pathname } = useLocation();
  return (
    <>
      {open && <div data-testid="backdrop" className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={onClose} />}
      <aside aria-label="Navigasi utama" className={`fixed md:static z-40 top-0 left-0 h-full w-60 bg-white border-r p-4 transition-transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <nav className="space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${pathname === to ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50"}`}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
