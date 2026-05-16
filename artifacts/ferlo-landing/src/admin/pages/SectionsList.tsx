import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { sectionLabels, SECTION_KEYS } from "@workspace/api-zod";
import { listSections } from "../cms/api";

export function SectionsList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-sections"],
    queryFn: listSections,
  });

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Sections</h1>
        <p className="text-muted-foreground mt-1">
          Edit text and images for each part of the public site. Changes save
          as a draft, then publish to make them live.
        </p>
      </header>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="text-destructive">Failed to load sections.</p>
      )}

      {data && (
        <ul className="divide-y divide-border border border-border rounded-xl bg-card">
          {SECTION_KEYS.map((key) => {
            const row = data.find((r) => r.sectionKey === key);
            const hasDraft = !!row?.hasDraft;
            const isPublished = !!row?.publishedData;
            return (
              <li key={key}>
                <Link
                  to={`/admin/sections/${key}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{sectionLabels[key]}</p>
                    <p className="text-xs text-muted-foreground">
                      {row?.updatedAt
                        ? `Updated ${new Date(row.updatedAt).toLocaleString()}`
                        : "Never edited"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {hasDraft && (
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-600">
                        Draft
                      </span>
                    )}
                    {isPublished && (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-600">
                        Published
                      </span>
                    )}
                    {!isPublished && !hasDraft && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        Default
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
