import { useState } from "react";
import { useDispatch } from "react-redux";
import useInput from "../../../hooks/useInput.js";
import { asyncChangeLostFound } from "../states/action.js";
import { showErrorDialog, showSuccessDialog, showWarningDialog } from "../../../helpers/toolsHelper.js";

export default function ChangeModal({ item, onClose, onDone }) {
  const dispatch = useDispatch();
  const [title, onTitle] = useInput(item.title);
  const [description, onDescription] = useInput(item.description);
  const [status, onStatus] = useInput(item.status);
  const [isCompleted, setIsCompleted] = useState(Boolean(Number(item.is_completed)));

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) { showWarningDialog("Judul dan deskripsi wajib diisi"); return; }
    const r = await dispatch(asyncChangeLostFound({ id: item.id, title, description, status, isCompleted }));
    if (asyncChangeLostFound.fulfilled.match(r)) { await showSuccessDialog("Laporan diperbarui"); onDone(); onClose(); }
    else showErrorDialog(r.payload ?? "Gagal");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <form onSubmit={submit} role="dialog" aria-modal="true" aria-label="Ubah laporan" className="bg-white rounded-xl p-5 w-full max-w-md space-y-3">
        <h2 className="font-bold text-lg">Ubah Laporan</h2>
        <input id="title" name="title" aria-label="Judul" value={title} onChange={onTitle} className="w-full border rounded-lg px-3 py-2" />
        <textarea id="description" name="description" aria-label="Deskripsi" value={description} onChange={onDescription} rows={4} className="w-full border rounded-lg p-2" />
        <select id="status" name="status" aria-label="Jenis laporan" value={status} onChange={onStatus} className="w-full border rounded-lg px-3 py-2">
          <option value="lost">Barang hilang</option>
          <option value="found">Barang ditemukan</option>
        </select>
        <label className="flex items-center gap-2">
          <input id="is_completed" name="is_completed" type="checkbox" checked={isCompleted} onChange={(e) => setIsCompleted(e.target.checked)} />
          Tandai selesai
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5">Batal</button>
          <button type="submit" className="bg-indigo-600 text-white rounded-lg px-4 py-1.5">Simpan</button>
        </div>
      </form>
    </div>
  );
}
