import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconPlus } from "@tabler/icons-react";
import useInput from "../../../hooks/useInput.js";
import { asyncGetLostFounds, asyncGetStats } from "../states/action.js";
import AddModal from "../modals/AddModal.jsx";
import { formatDate } from "../../../helpers/toolsHelper.js";

const done = (x) => Boolean(Number(x.is_completed));

export default function HomePage() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.lostFounds.lostFounds);
  const stats = useSelector((s) => s.lostFounds.lostFoundStats);
  const [isMe, setIsMe] = useState(false);
  const [status, setStatus] = useState("all");
  const [completed, setCompleted] = useState("all");
  const [search, onSearch] = useInput();
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    dispatch(asyncGetLostFounds({ isMe }));
    dispatch(asyncGetStats());
  }, [dispatch, isMe]);
  useEffect(load, [load]);

  const filtered = useMemo(
    () =>
      items.filter(
        (x) =>
          (status === "all" || x.status === status) &&
          (completed === "all" || done(x) === (completed === "1")) &&
          `${x.title} ${x.description}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, status, completed, search],
  );

  const cards = [
    ["Total", items.length],
    ["Barang Hilang", items.filter((x) => x.status === "lost").length],
    ["Barang Ditemukan", items.filter((x) => x.status === "found").length],
    ["Selesai", items.filter(done).length],
  ];

  const monthly = Array.isArray(stats?.monthly) ? stats.monthly : [];

  return (
    <div className="space-y-5">
      <h1 className="sr-only">Dashboard Lost &amp; Founds</h1>
      <section id="statistik" aria-label="Ringkasan statistik" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(([label, n]) => (
          <div key={label} className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-slate-600">{label}</p>
            <p className="text-2xl font-bold">{n}</p>
          </div>
        ))}
      </section>
      {monthly.length > 0 && (
        <p className="text-sm text-slate-600">Data statistik bulanan tersedia: {monthly.length} periode.</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border">
          <button onClick={() => setIsMe(false)} className={`px-4 py-1.5 ${!isMe ? "bg-indigo-600 text-white" : "bg-white"}`}>Semua</button>
          <button onClick={() => setIsMe(true)} className={`px-4 py-1.5 ${isMe ? "bg-indigo-600 text-white" : "bg-white"}`}>Laporan Saya</button>
        </div>
        <select aria-label="Filter jenis" value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-lg px-3 py-1.5 bg-white">
          <option value="all">Semua jenis</option>
          <option value="lost">Hilang</option>
          <option value="found">Ditemukan</option>
        </select>
        <select aria-label="Filter penyelesaian" value={completed} onChange={(e) => setCompleted(e.target.value)} className="border rounded-lg px-3 py-1.5 bg-white">
          <option value="all">Semua status</option>
          <option value="0">Belum selesai</option>
          <option value="1">Selesai</option>
        </select>
        <input id="search" name="search" aria-label="Cari laporan" placeholder="Cari laporan..." value={search} onChange={onSearch} className="flex-1 min-w-48 border rounded-lg px-3 py-1.5" />
        <button onClick={() => setAdding(true)} aria-label="Tambah laporan" className="flex items-center gap-1 bg-indigo-600 text-white rounded-lg px-3 py-1.5"><IconPlus size={16} /> Tambah</button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((x) => (
          <Link key={x.id} to={`/lost-founds/${x.id}`} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md">
            {x.cover && <img src={x.cover} alt={`Cover ${x.title}`} className="w-full h-44 object-cover" />}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${x.status === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>{x.status === "lost" ? "Hilang" : "Ditemukan"}</span>
                {done(x) && <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">Selesai</span>}
              </div>
              <p className="font-semibold">{x.title}</p>
              <p className="line-clamp-2 text-slate-700">{x.description}</p>
              <p className="text-xs text-slate-600">{formatDate(x.created_at)}</p>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-slate-600">Belum ada laporan.</p>}
      {adding && <AddModal onClose={() => setAdding(false)} onDone={load} />}
    </div>
  );
}
