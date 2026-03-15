import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage";
import HomePage from "./pages/HomePage/HomePage";
import CoursesPage from "./pages/CoursesPage/CoursesPage";
import CoursePage from "./pages/CoursePage/CoursePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route element={<Layout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;