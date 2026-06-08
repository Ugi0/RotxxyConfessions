import { BrowserRouter, Route, Routes } from "react-router-dom";
import ConfessionPage from "./Views/ConfessionPage";
import Login from "./Views/Login";
import StreamerView from "./Views/StreamerView";
import ModeratorView from "./Views/ModeratorView";
import { AuthProvider } from "./components/authProvider";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ConfessionPage />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/moderator"
            element={
              <ProtectedRoute roles={["moderator", "streamer"]}>
                <ModeratorView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/streamer"
            element={
              <ProtectedRoute roles={["streamer"]}>
                <StreamerView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}