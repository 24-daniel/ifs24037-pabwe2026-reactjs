import { Suspense, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAccessToken } from "../../../helpers/apiHelper.js";
import { asyncGetProfile } from "../../users/states/action.js";
import NavbarComponent from "../components/NavbarComponent.jsx";
import SidebarComponent from "../components/SidebarComponent.jsx";

const Loading = () => (
  <div role="status">
    <h1 className="sr-only">Memuat halaman</h1>
    <p className="text-slate-600">Memuat...</p>
  </div>
);

export default function LostFoundLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasToken = Boolean(getAccessToken());
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (!hasToken) return;
    dispatch(asyncGetProfile()).then((r) => {
      if (asyncGetProfile.fulfilled.match(r)) setReady(true);
      else navigate("/auth/login", { replace: true });
    });
  }, [hasToken, dispatch, navigate]);

  if (!hasToken) return <Navigate to="/auth/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarComponent onMenu={() => setDrawer(true)} />
      <div className="flex">
        <SidebarComponent open={drawer} onClose={() => setDrawer(false)} />
        <main className="flex-1 p-4 md:p-6">
          {ready ? (
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          ) : (
            <Loading />
          )}
        </main>
      </div>
    </div>
  );
}
