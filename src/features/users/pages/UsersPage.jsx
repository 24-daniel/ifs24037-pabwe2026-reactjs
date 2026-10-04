import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput.js";
import { asyncGetUsers } from "../states/action.js";

export default function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.users.users);
  const [search, onSearch] = useInput();

  useEffect(() => {
    const t = setTimeout(() => dispatch(asyncGetUsers(search || undefined)), 300);
    return () => clearTimeout(t);
  }, [dispatch, search]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Daftar Pengguna</h1>
      <input id="search" name="search" aria-label="Cari pengguna" placeholder="Cari pengguna..." value={search} onChange={onSearch} className="w-full max-w-md border rounded-lg px-3 py-2" />
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {users.map((u) => (
          <li key={u.id} className="bg-white rounded-xl shadow p-4">
            <p className="font-semibold">{u.name}</p>
            <p className="text-sm text-slate-600">{u.email}</p>
          </li>
        ))}
      </ul>
      {users.length === 0 && <p className="text-slate-600">Tidak ada pengguna.</p>}
    </div>
  );
}
