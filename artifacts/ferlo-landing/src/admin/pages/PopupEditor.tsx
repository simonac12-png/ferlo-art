import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { popupSchema, type PopupInput } from "@workspace/api-zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { TextField } from "../cms/forms/fields/TextField";
import { NumberField } from "../cms/forms/fields/NumberField";
import { ImageField } from "../cms/forms/fields/ImageField";
import {
  createPopup,
  deletePopup,
  getPopup,
  updatePopup,
} from "../cms/popups";

const emptyPopup: PopupInput = {
  name: "",
  title: "",
  body: "",
  ctaLabel: "",
  ctaUrl: "",
  triggerType: "after_delay",
  triggerValue: "5",
  isActive: false,
  dismissCookieDays: 7,
};

export function PopupEditor() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = !params.id || params.id === "new";
  const popupId = isNew ? null : params.id!;
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin-popup", popupId],
    queryFn: () => (popupId ? getPopup(popupId) : Promise.resolve(null)),
    enabled: !!popupId,
  });

  const form = useForm<PopupInput>({
    resolver: zodResolver(popupSchema),
    defaultValues: emptyPopup,
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        title: existing.title,
        body: existing.body,
        image: undefined,
        ctaLabel: existing.ctaLabel ?? "",
        ctaUrl: existing.ctaUrl ?? "",
        triggerType: existing.triggerType,
        triggerValue: existing.triggerValue ?? "",
        isActive: existing.isActive,
        dismissCookieDays: existing.dismissCookieDays,
      });
    }
  }, [existing, form]);

  const save = useMutation({
    mutationFn: async (values: PopupInput) => {
      if (popupId) return await updatePopup(popupId, values);
      return await createPopup(values);
    },
    onSuccess: (row) => {
      setActionError(null);
      qc.invalidateQueries({ queryKey: ["admin-popups"] });
      qc.invalidateQueries({ queryKey: ["site-popups"] });
      if (isNew && row?.id) {
        navigate(`/admin/popups/${row.id}`, { replace: true });
      }
    },
    onError: (err) => {
      setActionError(err instanceof Error ? err.message : "Save failed");
    },
  });

  const remove = useMutation({
    mutationFn: () => (popupId ? deletePopup(popupId) : Promise.resolve()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-popups"] });
      qc.invalidateQueries({ queryKey: ["site-popups"] });
      navigate("/admin/popups", { replace: true });
    },
  });

  if (!isNew && isLoading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  const triggerType = form.watch("triggerType");

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-muted-foreground mb-1">
        <Link to="/admin/popups" className="hover:text-foreground">
          ← All popups
        </Link>
      </p>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        {isNew ? "New popup" : "Edit popup"}
      </h1>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((values) => save.mutate(values))}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextField<PopupInput>
                name="name"
                label="Internal name"
                description="Shown only in the admin, helps you identify it."
              />
              <TextField<PopupInput> name="title" label="Title" />
              <TextField<PopupInput>
                name="body"
                label="Body"
                multiline
                rows={5}
              />
              <ImageField<PopupInput> name="image" label="Image (optional)" />
              <div className="grid md:grid-cols-2 gap-3">
                <TextField<PopupInput>
                  name="ctaLabel"
                  label="CTA label (optional)"
                />
                <TextField<PopupInput>
                  name="ctaUrl"
                  label="CTA URL (optional)"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trigger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="triggerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>When to show</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="on_load">
                          On page load
                        </SelectItem>
                        <SelectItem value="after_delay">
                          After a delay
                        </SelectItem>
                        <SelectItem value="exit_intent">
                          On exit intent (desktop)
                        </SelectItem>
                        <SelectItem value="on_click">
                          When user clicks an element
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {triggerType === "after_delay" && (
                <TextField<PopupInput>
                  name="triggerValue"
                  label="Delay (seconds)"
                  placeholder="5"
                />
              )}
              {triggerType === "on_click" && (
                <TextField<PopupInput>
                  name="triggerValue"
                  label="CSS selector"
                  placeholder='[data-testid="hero-join-waitlist"]'
                />
              )}
              <NumberField<PopupInput>
                name="dismissCookieDays"
                label="Days to remember dismissal"
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Active</FormLabel>
                    <FormDescription className="!mt-0">
                      Show this popup to public visitors.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : isNew ? "Create" : "Save"}
            </Button>
            {!isNew && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm("Delete this popup?")) remove.mutate();
                }}
                disabled={remove.isPending}
              >
                Delete
              </Button>
            )}
            {actionError && (
              <span className="text-sm text-destructive">{actionError}</span>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
