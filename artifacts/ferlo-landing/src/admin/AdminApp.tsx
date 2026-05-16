import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { SectionsList } from "./pages/SectionsList";
import { SectionEditor } from "./pages/SectionEditor";
import { MediaLibrary } from "./pages/MediaLibrary";
import { PopupsList } from "./pages/PopupsList";
import { PopupEditor } from "./pages/PopupEditor";

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="sections" element={<SectionsList />} />
        <Route path="sections/:key" element={<SectionEditor />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="popups" element={<PopupsList />} />
        <Route path="popups/new" element={<PopupEditor />} />
        <Route path="popups/:id" element={<PopupEditor />} />
      </Route>
    </Routes>
  );
}
