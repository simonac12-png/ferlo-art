import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth, useAdminLogout } from "./useAdminAuth";
import { Button } from "@/components/ui/button";

export function AdminLayout() {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const logout = useAdminLogout();

  const onLogout = async () => {
    await logout.mutateAsync();
    navigate("/admin/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-foreground/70 hover:bg-muted hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-60 shrink-0 border-r border-border bg-card/40 p-4 flex flex-col gap-1">
        <div className="px-3 py-4 mb-2">
          <p className="text-lg font-bold tracking-tight">FerLo CMS</p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
        <NavLink to="/admin" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/sections" className={linkClass}>
          Sections
        </NavLink>
        <NavLink to="/admin/media" className={linkClass}>
          Media
        </NavLink>
        <NavLink to="/admin/popups" className={linkClass}>
          Popups
        </NavLink>
        <div className="mt-auto pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onLogout}
            disabled={logout.isPending}
          >
            {logout.isPending ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
