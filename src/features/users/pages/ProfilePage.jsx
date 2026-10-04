import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput.js";
import {
  asyncGetProfile, asyncChangeProfile, asyncChangeProfilePhoto, asyncChangeProfilePassword,
} from "../states/action.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.users.profile);
  const [name, onName, setName] = useInput();
  const [email, onEmail, setEmail] = useInput();
  const [password, onPassword, setPassword] = useInput();
  const [newPassword, onNewPassword, setNewPassword] = useInput();

  useEffect(() => {
    if (profile) { setName(profile.name); setEmail(profile.email); }
  }, [profile, setName, setEmail]);

  const saveProfile = async (e) => {
    e.preventDefault();
    const r = await dispatch(asyncChangeProfile({ name, email }));
    if (asyncChangeProfile.fulfilled.match(r)) {
      await showSuccessDialog("Profil diperbarui");
      dispatch(asyncGetProfile());
    } else showErrorDialog(r.payload ?? "Gagal");
  };

  const savePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = await dispatch(asyncChangeProfilePhoto(file));
    if (asyncChangeProfilePhoto.fulfilled.match(r)) {
      await showSuccessDialog("Foto diperbarui");
      dispatch(asyncGetProfile());
    } else showErrorDialog(r.payload ?? "Gagal");
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const r = await dispatch(asyncChangeProfilePassword({ password, newPassword }));
    if (asyncChangeProfilePassword.fulfilled.match(r)) {
      await showSuccessDialog("Kata sandi diubah");
      setPassword(""); setNewPassword("");
    } else showErrorDialog(r.payload ?? "Gagal");
  };

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-bold">Profil Saya</h1>
      <section className="space-y-3">
        {profile?.photo && <img src={profile.photo} alt="avatar" className="w-24 h-24 rounded-full object-cover" />}
        <input id="photo" name="photo" aria-label="Unggah foto profil" type="file" accept="image/*" onChange={savePhoto} />
      </section>
      <form onSubmit={saveProfile} className="space-y-3">
        <input id="name" name="name" aria-label="Nama" value={name} onChange={onName} placeholder="Nama" className="w-full border rounded-lg px-3 py-2" />
        <input id="email" name="email" aria-label="Email" value={email} onChange={onEmail} placeholder="Email" className="w-full border rounded-lg px-3 py-2" />
        <button className="bg-indigo-600 text-white rounded-lg px-4 py-2">Simpan Profil</button>
      </form>
      <form onSubmit={savePassword} className="space-y-3">
        <input id="password" name="password" aria-label="Kata sandi lama" type="password" value={password} onChange={onPassword} placeholder="Kata sandi lama" className="w-full border rounded-lg px-3 py-2" />
        <input id="new_password" name="new_password" aria-label="Kata sandi baru" type="password" value={newPassword} onChange={onNewPassword} placeholder="Kata sandi baru" className="w-full border rounded-lg px-3 py-2" />
        <button className="bg-indigo-600 text-white rounded-lg px-4 py-2">Ubah Kata Sandi</button>
      </form>
    </div>
  );
}
