import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../../helpers/apiHelper.js";

export default function AuthLayout() {
  if (getAccessToken()) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <aside aria-label="Tentang aplikasi" className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-10">
        <div>
          <p className="text-4xl font-bold mb-3">Delcom Lost &amp; Founds</p>
          <p className="text-indigo-50">Laporkan barang hilang atau temuan dengan mudah.</p>
        </div>
      </aside>
      <main className="flex items-center justify-center p-6">
        <Suspense fallback={<h1 className="sr-only">Memuat halaman</h1>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
