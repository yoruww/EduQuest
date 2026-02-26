import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <Routes>
      {}
      <Route path="/" element={<AuthPage />} />

      {}
      <Route
        path="/home"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />

      <Route
        path="/courses"
        element={
          <Layout>
            <CoursesPage />
          </Layout>
        }
      />

      <Route
        path="/course/:id"
        element={
          <Layout>
            <CoursePage />
          </Layout>
        }
      />

      <Route
        path="/profile"
        element={
          <Layout>
            <ProfilePage />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;