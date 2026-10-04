import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetLostFound, asyncDeleteLostFound } from "../states/action.js";
import ChangeModal from "../modals/ChangeModal.jsx";
import ChangeCoverModal from "../modals/ChangeCoverModal.jsx";
import { formatDate, showConfirmDialog, showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const item = useSelector((s) => s.lostFounds.lostFound);
  const me = useSelector((s) => s.users.profile);
  const [modal, setModal] = useState(null);

  const load = useCallback(() => { dispatch(asyncGetLostFound(id)); }, [dispatch, id]);
  useEffect(load, [load]);

  if (!item) {
    return (
      <div role="status">
        <h1 className="sr-only">Memuat laporan</h1>
        <p className="text-slate-600">Memuat...</p>
      </div>
    );
  }
  const owner = item.user ?? item.author;
  const isOwner = Boolean(me) && me.id === owner?.id;
  const completed = Boolean(Number(item.is_completed));

  const remove = async () => {
    if (!(await showConfirmDialog("Hapus laporan ini?"))) return;
    const r = await dispatch(asyncDeleteLostFound(item.id));
    if (asyncDeleteLostFound.fulfilled.match(r)) { await showSuccessDialog("Laporan dihapus"); navigate("/", { replace: true }); }
    else showErrorDialog(r.payload ?? "Gagal");
  };

  return (
    <article className="max-w-2xl mx-auto bg-white rounded-xl shadow overflow-hidden">
      {item.cover && <img src={item.cover} alt={`Cover ${item.title}`} className="w-full max-h-96 object-contain bg-slate-100" />}
      <div className="p-5 space-y-4">
        <h1 className="text-2xl font-bold">{item.title}</h1>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded-full ${item.status === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>{item.status === "lost" ? "Hilang" : "Ditemukan"}</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">{completed ? "Selesai" : "Belum selesai"}</span>
        </div>
        <div>
          <p className="font-semibold">{owner?.name}</p>
          <p className="text-xs text-slate-600">{formatDate(item.created_at)}</p>
        </div>
        <p className="whitespace-pre-wrap">{item.description}</p>
        {isOwner && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setModal("cover")} className="px-3 py-1.5 rounded-lg border">Ubah Cover</button>
            <button onClick={() => setModal("edit")} className="px-3 py-1.5 rounded-lg border">Ubah Laporan</button>
            <button onClick={remove} className="px-3 py-1.5 rounded-lg bg-red-700 text-white">Hapus</button>
          </div>
        )}
      </div>
      {modal === "edit" && <ChangeModal item={item} onClose={() => setModal(null)} onDone={load} />}
      {modal === "cover" && <ChangeCoverModal id={item.id} onClose={() => setModal(null)} onDone={load} />}
    </article>
  );
}
