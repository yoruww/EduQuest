import { Route, Routes } from "react-router-dom";

import AuthPage from "./pages/AuthPage/AuthPage";
import HomePage from "./pages/HomePage/HomePage";
import CoursesPage from "./pages/CoursesPage/CoursesPage";
import CoursePage from "./pages/CoursePage/CoursePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

import Layout from "./components/Layout/Layout";

import { APP_ROUTES } from "./constants/routes";

function App() {
  return (
    <Routes>
      <Route path={APP_ROUTES.auth} element={<AuthPage />} />

      <Route element={<Layout />}>
        <Route path={APP_ROUTES.home} element={<HomePage />} />
        <Route path={APP_ROUTES.courses} element={<CoursesPage />} />
        <Route path={APP_ROUTES.course} element={<CoursePage />} />
        <Route path={APP_ROUTES.profile} element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;