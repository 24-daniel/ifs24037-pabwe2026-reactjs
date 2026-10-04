import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./features/auth/layouts/AuthLayout.jsx";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import LostFoundLayout from "./features/lost-founds/layouts/LostFoundLayout.jsx";

const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage.jsx"));
const HomePage = lazy(() => import("./features/lost-founds/pages/HomePage.jsx"));
const DetailPage = lazy(() => import("./features/lost-founds/pages/DetailPage.jsx"));
const UsersPage = lazy(() => import("./features/users/pages/UsersPage.jsx"));
const ProfilePage = lazy(() => import("./features/users/pages/ProfilePage.jsx"));

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route path="/" element={<LostFoundLayout />}>
        <Route index element={<HomePage />} />
        <Route path="lost-founds/:id" element={<DetailPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
