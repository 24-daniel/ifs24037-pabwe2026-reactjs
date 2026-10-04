import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconMenu2, IconLogout, IconSearch } from "@tabler/icons-react";
import { asyncLogout } from "../../auth/states/action.js";
import { resetUsers } from "../../users/states/reducer.js";

export default function NavbarComponent({ onMenu }) {
  const profile = useSelector((s) => s.users.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await dispatch(asyncLogout());
    dispatch(resetUsers());
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b flex items-center justify-between px-4 h-14">
      <button aria-label="Buka menu" onClick={onMenu} className="md:hidden p-2"><IconMenu2 size={20} /></button>
      <span className="flex items-center gap-2 font-bold text-indigo-700"><IconSearch size={18} /> Lost &amp; Founds</span>
      <div className="relative">
        <button onClick={() => setOpen(!open)} aria-label="Menu akun" aria-expanded={open} className="flex items-center gap-2">
          {profile?.photo ? (
            <img src={profile.photo} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="w-8 h-8 rounded-full bg-indigo-100 grid place-items-center text-sm">{profile?.name?.[0] ?? "?"}</span>
          )}
          <span className="hidden sm:block text-sm">{profile?.name}</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow">
            <p className="px-3 py-2 text-xs text-slate-600 truncate">{profile?.email}</p>
            <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50"><IconLogout size={16} /> Keluar</button>
          </div>
        )}
      </div>
    </header>
  );
}
