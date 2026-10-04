import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useInput from "../../../hooks/useInput.js";
import { asyncLogin } from "../states/action.js";
import { showErrorDialog, showSuccessToast, showWarningDialog } from "../../../helpers/toolsHelper.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, onEmail] = useInput();
  const [password, onPassword] = useInput();

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showWarningDialog("Email dan kata sandi wajib diisi");
      return;
    }
    const res = await dispatch(asyncLogin({ email, password }));
    if (asyncLogin.fulfilled.match(res)) {
      showSuccessToast("Login berhasil");
      navigate("/", { replace: true });
    } else {
      showErrorDialog(res.payload ?? "Login gagal");
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Masuk</h1>
      <input id="login-email-input" name="email" aria-label="Email" autoComplete="email" type="email" placeholder="Email" value={email} onChange={onEmail} className="w-full border rounded-lg px-3 py-2" />
      <input id="login-password-input" name="password" aria-label="Kata sandi" autoComplete="current-password" type="password" placeholder="Kata sandi" value={password} onChange={onPassword} className="w-full border rounded-lg px-3 py-2" />
      <button id="login-submit-button" type="submit" className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700">Masuk</button>
      <p className="text-sm text-center">Belum punya akun? <Link to="/auth/register" className="text-indigo-700 underline">Daftar</Link></p>
    </form>
  );
}
