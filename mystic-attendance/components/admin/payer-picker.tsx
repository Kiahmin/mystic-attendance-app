"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, ChevronsUpDown, Pencil, Plus } from "lucide-react";
import {
  createPayer,
  updatePayer,
  type PayerInput,
} from "@/lib/actions/payers";
import {
  PAYER_KIND_LABELS,
  PAYER_KINDS,
  payerLabel,
} from "@/lib/payer-utils";
import type { Payer, PayerKind } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PayerPickerProps = {
  id?: string;
  payers: Payer[];
  value: string;
  onChange: (payerId: string) => void;
  onCreated?: (payer: Payer) => void;
  onUpdated?: (payer: Payer) => void;
  allowNone?: boolean;
  noneLabel?: string;
};

export function PayerPicker({
  id,
  payers,
  value,
  onChange,
  onCreated,
  onUpdated,
  allowNone = true,
  noneLabel = "No payer",
}: PayerPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Payer | null>(null);
  const [kind, setKind] = useState<PayerKind>("person");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selected = payers.find((payer) => payer.id === value) ?? null;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return payers;
    return payers.filter((payer) => {
      const haystacks = [payer.display_name, payer.phone];
      return haystacks.some((item) => item?.toLowerCase().includes(q));
    });
  }, [payers, query]);

  function resetForm() {
    setDisplayName("");
    setPhone("");
    setKind("person");
    setEditing(null);
    setError(null);
  }

  function openCreate() {
    resetForm();
    setDialogOpen(true);
  }

  function openEdit() {
    if (!selected) return;
    setEditing(selected);
    setKind(selected.kind);
    setDisplayName(selected.display_name ?? "");
    setPhone(selected.phone ?? "");
    setError(null);
    setDialogOpen(true);
    setOpen(false);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const input: PayerInput = {
      kind,
      display_name: displayName,
      phone,
      notes: editing?.notes ?? null,
    };
    const editingId = editing?.id ?? null;
    startTransition(async () => {
      const result = editingId
        ? await updatePayer(editingId, input)
        : await createPayer(input);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      if (result.payer) {
        if (editingId) {
          onUpdated?.(result.payer);
        } else {
          onCreated?.(result.payer);
          onChange(result.payer.id);
        }
      }
      setDialogOpen(false);
      setOpen(false);
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-9 min-w-0 flex-1 justify-between font-normal"
          >
            <span className="truncate">
              {selected ? payerLabel(selected) : noneLabel}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or phone…"
            className="mb-2 h-8"
          />
          <div className="max-h-56 overflow-y-auto">
            {allowNone ? (
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                  !value
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn("size-4", value ? "opacity-0" : "opacity-100")}
                />
                {noneLabel}
              </button>
            ) : null}
            {filtered.map((payer) => (
              <button
                key={payer.id}
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                  payer.id === value
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => {
                  onChange(payer.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "size-4",
                    payer.id === value ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="min-w-0 truncate">{payerLabel(payer)}</span>
              </button>
            ))}
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                No matching payers.
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            className="mt-2 w-full justify-start"
            onClick={openCreate}
          >
            <Plus className="size-4" />
            Add payer
          </Button>
        </PopoverContent>
      </Popover>
      {selected ? (
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="shrink-0"
          aria-label={`Edit ${payerLabel(selected)}`}
          onClick={openEdit}
        >
          <Pencil className="size-4" />
        </Button>
      ) : null}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(next) => {
          setDialogOpen(next);
          if (!next) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit payer" : "Add payer"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Changes apply everywhere this payer is used."
                : "Parent, company, or a phone number if the name is not on file."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {PAYER_KINDS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setKind(option)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-medium",
                      kind === option
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {PAYER_KIND_LABELS[option]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payer_display_name">Name</Label>
              <Input
                id="payer_display_name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={
                  kind === "company" ? "Fufu Technologies PTE LTD" : "Koh Soon Peng"
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payer_phone">Phone</Label>
              <Input
                id="payer_phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9029 4474"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending
                  ? "Saving…"
                  : editing
                    ? "Save changes"
                    : "Add payer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
