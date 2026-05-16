import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { deletePopup, listPopups, type PopupRow } from "../cms/popups";

const triggerLabels: Record<PopupRow["triggerType"], string> = {
  on_load: "On page load",
  after_delay: "After delay",
  exit_intent: "On exit intent",
  on_click: "On click",
};

export function PopupsList() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-popups"],
    queryFn: listPopups,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deletePopup(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-popups"] }),
  });

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Popups</h1>
          <p className="text-muted-foreground mt-1">
            Modals shown to visitors on page load, after a delay, on exit
            intent, or when they click a chosen element.
          </p>
        </div>
        <Link to="/admin/popups/new">
          <Button>New popup</Button>
        </Link>
      </header>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {isError && <p className="text-destructive">Failed to load popups.</p>}
      {data && data.length === 0 && (
        <p className="text-muted-foreground">No popups yet.</p>
      )}

      {data && data.length > 0 && (
        <ul className="divide-y divide-border border border-border rounded-xl bg-card">
          {data.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p className="font-semibold">
                  {p.name}{" "}
                  {p.isActive ? (
                    <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Inactive
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Trigger: {triggerLabels[p.triggerType]}
                  {p.triggerValue ? ` · ${p.triggerValue}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/popups/${p.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Delete "${p.name}"?`)) remove.mutate(p.id);
                  }}
                  disabled={remove.isPending}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
