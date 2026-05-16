import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { listMedia, uploadMedia, type MediaRow } from "../media";

type SelectedImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  mediaId: string;
};

export function ImagePicker({
  onSelect,
  trigger,
}: {
  onSelect: (img: SelectedImage) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: listMedia,
    enabled: open,
  });

  const handleUpload = useMutation({
    mutationFn: async (files: FileList) => {
      const uploaded: MediaRow[] = [];
      for (const file of Array.from(files)) {
        await uploadMedia(file);
      }
      return uploaded;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (err) => {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    },
  });

  const select = (row: MediaRow) => {
    onSelect({
      url: row.blobUrl,
      alt: row.alt,
      width: row.width ?? undefined,
      height: row.height ?? undefined,
      mediaId: row.id,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            Pick from library
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select an image</DialogTitle>
          <DialogDescription>
            Click an image to use it, or upload a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            multiple
            hidden
            onChange={(e) => {
              setUploadError(null);
              if (e.target.files) handleUpload.mutate(e.target.files);
              if (fileRef.current) fileRef.current.value = "";
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={handleUpload.isPending}
          >
            {handleUpload.isPending ? "Uploading…" : "Upload new"}
          </Button>
          {uploadError && (
            <span className="text-sm text-destructive">{uploadError}</span>
          )}
        </div>

        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {data && data.length === 0 && (
          <p className="text-muted-foreground">
            No images uploaded yet. Use "Upload new" above.
          </p>
        )}
        {data && data.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {data.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => select(row)}
                className="border border-border rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-shadow text-left bg-card"
              >
                <div className="aspect-square bg-muted/40 flex items-center justify-center">
                  <img
                    src={row.blobUrl}
                    alt={row.alt}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs p-2 truncate">{row.blobPathname}</p>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
