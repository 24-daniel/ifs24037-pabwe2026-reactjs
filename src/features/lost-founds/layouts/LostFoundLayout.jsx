import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAccessToken } from "../../../helpers/apiHelper.js";
import { asyncGetProfile } from "../../users/states/action.js";
import NavbarComponent from "../components/NavbarComponent.jsx";
import SidebarComponent from "../components/SidebarComponent.jsx";

export default function LostFoundLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) { navigate("/auth/login", { replace: true }); return; }
    dispatch(asyncGetProfile()).then((r) => {
      if (asyncGetProfile.fulfilled.match(r)) setReady(true);
      else navigate("/auth/login", { replace: true });
    });
  }, [dispatch, navigate]);

  if (!ready) return null;
  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarComponent onMenu={() => setDrawer(true)} />
      <div className="flex">
        <SidebarComponent open={drawer} onClose={() => setDrawer(false)} />
        <main className="flex-1 p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
