import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  description?: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
};

export function TextField<T extends FieldValues>({
  name,
  label,
  description,
  multiline,
  rows = 4,
  placeholder,
}: Props<T>) {
  const { control } = useFormContext<T>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {multiline ? (
              <Textarea
                rows={rows}
                placeholder={placeholder}
                {...field}
                value={(field.value as string | undefined) ?? ""}
              />
            ) : (
              <Input
                placeholder={placeholder}
                {...field}
                value={(field.value as string | undefined) ?? ""}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
