import type { FieldPath, FieldValues } from "react-hook-form";
import { TextField } from "./TextField";

type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
};

export function LinkField<T extends FieldValues>({ name, label }: Props<T>) {
  return (
    <fieldset className="border border-border rounded-lg p-4 space-y-3">
      <legend className="px-2 text-sm font-semibold">{label}</legend>
      <TextField
        name={`${name}.label` as FieldPath<T>}
        label="Button label"
      />
      <TextField
        name={`${name}.href` as FieldPath<T>}
        label="Link target"
        placeholder="#waitlist or https://…"
      />
    </fieldset>
  );
}
