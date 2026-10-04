import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useInput from "../../../hooks/useInput.js";
import { asyncRegister } from "../states/action.js";
import { showErrorDialog, showSuccessToast, showWarningDialog } from "../../../helpers/toolsHelper.js";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, onName] = useInput();
  const [email, onEmail] = useInput();
  const [password, onPassword] = useInput();

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || password.length < 6) {
      showWarningDialog("Lengkapi data; kata sandi minimal 6 karakter");
      return;
    }
    const res = await dispatch(asyncRegister({ name, email, password }));
    if (asyncRegister.fulfilled.match(res)) {
      showSuccessToast("Registrasi berhasil, silakan login");
      navigate("/auth/login", { replace: true });
    } else {
      showErrorDialog(res.payload ?? "Registrasi gagal");
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Daftar</h1>
      <input id="register-name-input" name="name" aria-label="Nama" autoComplete="name" placeholder="Nama" value={name} onChange={onName} className="w-full border rounded-lg px-3 py-2" />
      <input id="register-email-input" name="email" aria-label="Email" autoComplete="email" type="email" placeholder="Email" value={email} onChange={onEmail} className="w-full border rounded-lg px-3 py-2" />
      <input id="register-password-input" name="password" aria-label="Kata sandi" autoComplete="new-password" type="password" placeholder="Kata sandi" value={password} onChange={onPassword} className="w-full border rounded-lg px-3 py-2" />
      <button id="register-submit-button" type="submit" className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700">Daftar</button>
      <p className="text-sm text-center">Sudah punya akun? <Link to="/auth/login" className="text-indigo-700 underline">Masuk</Link></p>
    </form>
  );
}
