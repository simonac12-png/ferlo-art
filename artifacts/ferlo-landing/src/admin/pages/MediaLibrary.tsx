import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteMedia,
  listMedia,
  updateMediaAlt,
  uploadMedia,
  type MediaRow,
} from "../cms/media";

export function MediaLibrary() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-media"],
    queryFn: listMedia,
  });

  const onUploadFiles = async (files: FileList | null) => {
    if (!files) return;
    setUploadError(null);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file);
      }
      qc.invalidateQueries({ queryKey: ["admin-media"] });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media library</h1>
          <p className="text-muted-foreground mt-1">
            Upload images here, then reference them from section editors and
            popups.
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            multiple
            hidden
            onChange={(e) => onUploadFiles(e.target.files)}
          />
          <Button onClick={() => fileRef.current?.click()}>Upload image</Button>
        </div>
      </header>

      {uploadError && (
        <p className="mb-4 text-destructive">{uploadError}</p>
      )}

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {isError && <p className="text-destructive">Failed to load media.</p>}

      {data && data.length === 0 && (
        <p className="text-muted-foreground">No images yet. Upload your first.</p>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((row) => (
            <MediaCard key={row.id} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaCard({ row }: { row: MediaRow }) {
  const qc = useQueryClient();
  const [alt, setAlt] = useState(row.alt);
  const [editing, setEditing] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const saveAlt = useMutation({
    mutationFn: () => updateMediaAlt(row.id, alt),
    onSuccess: () => {
      setEditing(false);
      qc.invalidateQueries({ queryKey: ["admin-media"] });
    },
  });

  const remove = useMutation({
    mutationFn: () => deleteMedia(row.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (err) => {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    },
  });

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="aspect-square bg-muted/40 flex items-center justify-center">
        <img
          src={row.blobUrl}
          alt={row.alt}
          loading="lazy"
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="p-3 text-xs">
        {editing ? (
          <div className="flex flex-col gap-2">
            <Input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Alt text"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => saveAlt.mutate()}
                disabled={saveAlt.isPending}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAlt(row.alt);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="truncate font-medium">{row.blobPathname}</p>
            <p className="text-muted-foreground truncate">
              {row.alt || <span className="italic">no alt text</span>}
            </p>
            <div className="mt-2 flex justify-between gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
              >
                Edit alt
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (confirm("Delete this image?")) remove.mutate();
                }}
                disabled={remove.isPending}
              >
                Delete
              </Button>
            </div>
            {deleteError && (
              <p className="mt-2 text-destructive">{deleteError}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
