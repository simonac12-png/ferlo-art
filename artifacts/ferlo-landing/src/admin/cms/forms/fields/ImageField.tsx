import type { FieldPath, FieldValues, Path, PathValue } from "react-hook-form";
import { useFormContext, useWatch } from "react-hook-form";
import { TextField } from "./TextField";
import { NumberField } from "./NumberField";
import { ImagePicker } from "../../components/ImagePicker";

type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
};

/**
 * Image reference editor. Edits { url, alt, width?, height?, mediaId? } in
 * place. The "Pick from library" button opens the media library dialog and
 * fills in the fields for the selected image.
 */
export function ImageField<T extends FieldValues>({ name, label }: Props<T>) {
  const { control, setValue } = useFormContext<T>();
  const url = useWatch({ control, name: `${name}.url` as FieldPath<T> });

  const onPick = (img: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    mediaId: string;
  }) => {
    type V = PathValue<T, Path<T>>;
    setValue(`${name}.url` as Path<T>, img.url as V, { shouldDirty: true });
    setValue(`${name}.alt` as Path<T>, img.alt as V, { shouldDirty: true });
    setValue(
      `${name}.width` as Path<T>,
      (img.width ?? undefined) as V,
      { shouldDirty: true },
    );
    setValue(
      `${name}.height` as Path<T>,
      (img.height ?? undefined) as V,
      { shouldDirty: true },
    );
    setValue(`${name}.mediaId` as Path<T>, img.mediaId as V, {
      shouldDirty: true,
    });
  };

  return (
    <fieldset className="border border-border rounded-lg p-4 space-y-3">
      <legend className="px-2 text-sm font-semibold">{label}</legend>
      <div className="flex gap-4 items-start">
        <div className="w-24 h-24 rounded-md border border-border bg-muted/40 overflow-hidden flex-shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">
          {typeof url === "string" && url ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img src={url} className="w-full h-full object-cover" />
          ) : (
            <span>No image</span>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex justify-end">
            <ImagePicker onSelect={onPick} />
          </div>
          <TextField
            name={`${name}.url` as FieldPath<T>}
            label="URL"
            placeholder="/image.png or https://…"
          />
          <TextField
            name={`${name}.alt` as FieldPath<T>}
            label="Alt text"
            placeholder="Describe the image for accessibility"
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              name={`${name}.width` as FieldPath<T>}
              label="Width (px)"
            />
            <NumberField
              name={`${name}.height` as FieldPath<T>}
              label="Height (px)"
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
}
