import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultContent,
  sectionLabels,
  sectionSchemas,
  type SectionKey,
} from "@workspace/api-zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  discardSectionDraft,
  getSection,
  initialEditorValue,
  isKnownSectionKey,
  publishSection,
  saveSectionDraft,
} from "../cms/api";
import { SECTION_FORMS } from "../cms/forms/sectionForms";

export function SectionEditor() {
  const params = useParams<{ key: string }>();
  const key = params.key;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  if (!key || !isKnownSectionKey(key)) {
    return (
      <div>
        <p className="text-destructive">Unknown section.</p>
        <Link
          to="/admin/sections"
          className="text-primary underline mt-2 inline-block"
        >
          Back to sections
        </Link>
      </div>
    );
  }

  return <SectionEditorBody sectionKey={key} navigate={navigate} qc={qc} actionError={actionError} setActionError={setActionError} actionStatus={actionStatus} setActionStatus={setActionStatus} />;
}

function SectionEditorBody({
  sectionKey,
  navigate,
  qc,
  actionError,
  setActionError,
  actionStatus,
  setActionStatus,
}: {
  sectionKey: SectionKey;
  navigate: ReturnType<typeof useNavigate>;
  qc: ReturnType<typeof useQueryClient>;
  actionError: string | null;
  setActionError: (s: string | null) => void;
  actionStatus: string | null;
  setActionStatus: (s: string | null) => void;
}) {
  const { data: row, isLoading, isError } = useQuery({
    queryKey: ["admin-section", sectionKey],
    queryFn: () => getSection(sectionKey),
  });

  const schema = sectionSchemas[sectionKey];
  const FormComponent = SECTION_FORMS[sectionKey];

  type Values = Record<string, unknown>;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: defaultContent[sectionKey] as unknown as Values,
    mode: "onBlur",
  });

  useEffect(() => {
    if (row) {
      form.reset(initialEditorValue(row) as Values);
    }
  }, [row, form]);

  const saveDraft = useMutation({
    mutationFn: (values: Values) => saveSectionDraft(sectionKey, values),
    onSuccess: () => {
      setActionStatus("Draft saved.");
      setActionError(null);
      qc.invalidateQueries({ queryKey: ["admin-section", sectionKey] });
      qc.invalidateQueries({ queryKey: ["admin-sections"] });
    },
    onError: (err) => {
      setActionStatus(null);
      setActionError(err instanceof Error ? err.message : "Save failed");
    },
  });

  const publish = useMutation({
    mutationFn: async () => {
      // Save current form state as draft first, then publish
      const values = form.getValues();
      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        throw new Error("Fix validation errors before publishing.");
      }
      await saveSectionDraft(sectionKey, parsed.data);
      await publishSection(sectionKey);
    },
    onSuccess: () => {
      setActionStatus("Published. Live within ~60s.");
      setActionError(null);
      qc.invalidateQueries({ queryKey: ["admin-section", sectionKey] });
      qc.invalidateQueries({ queryKey: ["admin-sections"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
    },
    onError: (err) => {
      setActionStatus(null);
      setActionError(err instanceof Error ? err.message : "Publish failed");
    },
  });

  const discardDraft = useMutation({
    mutationFn: () => discardSectionDraft(sectionKey),
    onSuccess: async () => {
      setActionStatus("Draft discarded.");
      setActionError(null);
      const fresh = await getSection(sectionKey);
      qc.setQueryData(["admin-section", sectionKey], fresh);
      form.reset(initialEditorValue(fresh) as Values);
      qc.invalidateQueries({ queryKey: ["admin-sections"] });
    },
    onError: (err) => {
      setActionStatus(null);
      setActionError(err instanceof Error ? err.message : "Discard failed");
    },
  });

  const onSubmit = form.handleSubmit((values) => saveDraft.mutate(values));

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (isError || !row)
    return <p className="text-destructive">Failed to load section.</p>;

  const hasDraft = row.draftData != null;

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link to="/admin/sections" className="hover:text-foreground">
              ← All sections
            </Link>
          </p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">
            {sectionLabels[sectionKey]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {hasDraft
              ? "You have unpublished changes."
              : row.publishedAt
                ? `Published ${new Date(row.publishedAt).toLocaleString()}`
                : "Not yet published — site is showing the built-in default."}
          </p>
        </div>
      </div>

      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Save as a draft to keep working. Publish when ready — your
                changes will appear on the public site shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormComponent />
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={saveDraft.isPending}>
              {saveDraft.isPending ? "Saving…" : "Save draft"}
            </Button>
            <Button
              type="button"
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-600/90"
              onClick={() => publish.mutate()}
              disabled={publish.isPending}
            >
              {publish.isPending ? "Publishing…" : "Publish"}
            </Button>
            {hasDraft && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm("Discard your unpublished changes?")) {
                    discardDraft.mutate();
                  }
                }}
                disabled={discardDraft.isPending}
              >
                Discard draft
              </Button>
            )}
            <div className="ml-auto text-sm">
              {actionError && (
                <span className="text-destructive">{actionError}</span>
              )}
              {actionStatus && !actionError && (
                <span className="text-emerald-600">{actionStatus}</span>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
