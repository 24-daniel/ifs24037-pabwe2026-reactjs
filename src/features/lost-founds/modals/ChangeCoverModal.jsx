import { useState } from "react";
import { useDispatch } from "react-redux";
import { asyncChangeCover } from "../states/action.js";
import { showErrorDialog, showSuccessDialog, showWarningDialog } from "../../../helpers/toolsHelper.js";

export default function ChangeCoverModal({ id, onClose, onDone }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const pick = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { showWarningDialog("Pilih gambar terlebih dahulu"); return; }
    const r = await dispatch(asyncChangeCover({ id, file }));
    if (asyncChangeCover.fulfilled.match(r)) { await showSuccessDialog("Cover diperbarui"); onDone(); onClose(); }
    else showErrorDialog(r.payload ?? "Gagal");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <form onSubmit={submit} role="dialog" aria-modal="true" aria-label="Ubah cover" className="bg-white rounded-xl p-5 w-full max-w-md space-y-3">
        <h2 className="font-bold text-lg">Ubah Cover</h2>
        <input id="cover" name="cover" aria-label="Pilih gambar cover" type="file" accept="image/*" onChange={pick} data-testid="cover-input" />
        {preview && <img src={preview} alt="pratinjau cover" className="w-full rounded-lg" />}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5">Batal</button>
          <button type="submit" className="bg-indigo-600 text-white rounded-lg px-4 py-1.5">Unggah</button>
        </div>
      </form>
    </div>
  );
}
