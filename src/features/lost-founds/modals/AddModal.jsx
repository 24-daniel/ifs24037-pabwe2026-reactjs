import { useDispatch } from "react-redux";
import useInput from "../../../hooks/useInput.js";
import { asyncAddLostFound } from "../states/action.js";
import { showErrorDialog, showSuccessDialog, showWarningDialog } from "../../../helpers/toolsHelper.js";

export default function AddModal({ onClose, onDone }) {
  const dispatch = useDispatch();
  const [title, onTitle] = useInput();
  const [description, onDescription] = useInput();
  const [status, onStatus] = useInput("lost");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) { showWarningDialog("Judul dan deskripsi wajib diisi"); return; }
    const r = await dispatch(asyncAddLostFound({ title, description, status }));
    if (asyncAddLostFound.fulfilled.match(r)) { await showSuccessDialog("Laporan ditambahkan"); onDone(); onClose(); }
    else showErrorDialog(r.payload ?? "Gagal");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <form onSubmit={submit} role="dialog" aria-modal="true" aria-label="Laporan baru" className="bg-white rounded-xl p-5 w-full max-w-md space-y-3">
        <h2 className="font-bold text-lg">Laporan Baru</h2>
        <input id="title" name="title" aria-label="Judul" value={title} onChange={onTitle} placeholder="Judul" className="w-full border rounded-lg px-3 py-2" />
        <textarea id="description" name="description" aria-label="Deskripsi" value={description} onChange={onDescription} rows={4} placeholder="Deskripsi" className="w-full border rounded-lg p-2" />
        <select id="status" name="status" aria-label="Jenis laporan" value={status} onChange={onStatus} className="w-full border rounded-lg px-3 py-2">
          <option value="lost">Barang hilang</option>
          <option value="found">Barang ditemukan</option>
        </select>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5">Batal</button>
          <button type="submit" className="bg-indigo-600 text-white rounded-lg px-4 py-1.5">Simpan</button>
        </div>
      </form>
    </div>
  );
}
