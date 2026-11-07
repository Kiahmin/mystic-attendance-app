"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  createPayer,
  updatePayer,
  type PayerInput,
} from "@/lib/actions/payers";
import { payerLabel } from "@/lib/payer-utils";
import type { Payer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PayerPickerProps = {
  id?: string;
  payers: Payer[];
  value: string;
  onChange: (payerId: string) => void;
  onCreated?: (payer: Payer) => void;
  onUpdated?: (payer: Payer) => void;
  allowNone?: boolean;
  noneLabel?: string;
  excludeStudentId?: string;
};

type Committed = {
  id: string;
  name: string;
  phone: string;
};

function alsoUsedLabel(names: string[]): string | null {
  if (names.length === 0) return null;
  if (names.length === 1) return `Also used by ${names[0]}`;
  if (names.length === 2) {
    return `Also used by ${names[0]} and ${names[1]}`;
  }
  return `Also used by ${names[0]}, ${names[1]}, and ${names.length - 2} more`;
}

export function PayerPicker({
  id,
  payers,
  value,
  onChange,
  onCreated,
  onUpdated,
  allowNone = true,
  excludeStudentId,
}: PayerPickerProps) {
  const selected = payers.find((payer) => payer.id === value) ?? null;
  const rootRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState(selected?.display_name ?? "");
  const [phone, setPhone] = useState(selected?.phone ?? "");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const nameRef = useRef(name);
  const phoneRef = useRef(phone);
  const committedRef = useRef<Committed>({
    id: value,
    name: selected?.display_name ?? "",
    phone: selected?.phone ?? "",
  });
  const lockRef = useRef<Promise<boolean> | null>(null);
  const dirtyRef = useRef(false);

  nameRef.current = name;
  phoneRef.current = phone;
  dirtyRef.current =
    name.trim() !== committedRef.current.name ||
    phone.trim() !== committedRef.current.phone;

  useEffect(() => {
    const next = payers.find((payer) => payer.id === value) ?? null;
    const nextName = next?.display_name ?? "";
    const nextPhone = next?.phone ?? "";
    committedRef.current = { id: value, name: nextName, phone: nextPhone };
    setName(nextName);
    setPhone(nextPhone);
    setError(null);
    setOpen(false);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps -- reset only when the linked payer changes

  const commitRef = useRef<() => Promise<boolean>>(async () => true);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onSubmit = (event: Event) => {
      if (!dirtyRef.current && !lockRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      void (async () => {
        const ok = await commitRef.current();
        if (ok) form.requestSubmit();
      })();
    };
    form.addEventListener("submit", onSubmit, true);
    return () => form.removeEventListener("submit", onSubmit, true);
  }, []);

  const query = name.trim().toLowerCase();
  const suggestions = query
    ? payers
        .filter((payer) => {
          if (payer.id === value) return false;
          return [payer.display_name, payer.phone].some((item) =>
            item?.toLowerCase().includes(query)
          );
        })
        .slice(0, 8)
    : [];

  const savedName = (selected?.display_name ?? "").trim();
  const renaming = Boolean(selected) && name.trim() !== savedName;
  const otherNames = (selected?.used_by ?? [])
    .filter((student) => student.id !== excludeStudentId)
    .map((student) => student.full_name);
  const sharedWarning = renaming ? alsoUsedLabel(otherNames) : null;

  function applyCommitted(next: Committed) {
    committedRef.current = next;
    dirtyRef.current = false;
    setName(next.name);
    setPhone(next.phone);
  }

  function linkPayer(payer: Payer) {
    const next = {
      id: payer.id,
      name: payer.display_name ?? "",
      phone: payer.phone ?? "",
    };
    flushSync(() => {
      onChange(payer.id);
    });
    applyCommitted(next);
    setError(null);
    setOpen(false);
  }

  async function commit(): Promise<boolean> {
    if (lockRef.current) return lockRef.current;
    const promise = persist();
    lockRef.current = promise;
    try {
      return await promise;
    } finally {
      lockRef.current = null;
    }
  }

  commitRef.current = commit;

  async function persist(): Promise<boolean> {
    const trimmedName = nameRef.current.trim();
    const trimmedPhone = phoneRef.current.trim();
    const committed = committedRef.current;
    if (
      trimmedName === committed.name &&
      trimmedPhone === committed.phone
    ) {
      return true;
    }

    setError(null);

    if (!trimmedName && !trimmedPhone) {
      if (!allowNone) {
        setError("Enter a payer name.");
        return false;
      }
      flushSync(() => {
        onChange("");
      });
      applyCommitted({ id: "", name: "", phone: "" });
      return true;
    }

    const exact = trimmedName
      ? payers.filter(
          (payer) =>
            (payer.display_name ?? "").trim().toLowerCase() ===
            trimmedName.toLowerCase()
        )
      : [];
    const current = payers.find((payer) => payer.id === committed.id) ?? null;

    if (current && trimmedName !== committed.name) {
      const otherExact = exact.filter((payer) => payer.id !== current.id);
      if (otherExact.length === 1) {
        linkPayer(otherExact[0]);
        return true;
      }
    }

    if (!current && exact.length === 1) {
      linkPayer(exact[0]);
      return true;
    }
    if (!current && exact.length > 1) {
      setError("Several payers use this name. Choose one from the list.");
      setOpen(true);
      return false;
    }

    const input: PayerInput = current
      ? {
          kind: current.kind,
          display_name: trimmedName,
          phone: trimmedPhone,
          notes: current.notes,
        }
      : {
          kind: "person",
          display_name: trimmedName,
          phone: trimmedPhone,
        };

    setPending(true);
    const result = current
      ? await updatePayer(current.id, input)
      : await createPayer(input);
    setPending(false);

    if ("error" in result && result.error) {
      setError(result.error);
      return false;
    }
    if (!result.payer) {
      setError("Could not save the payer.");
      return false;
    }

    const saved: Committed = {
      id: result.payer.id,
      name: result.payer.display_name ?? "",
      phone: result.payer.phone ?? "",
    };
    flushSync(() => {
      if (current) {
        onUpdated?.({ ...result.payer, used_by: current.used_by });
      } else {
        onCreated?.(result.payer);
        onChange(result.payer.id);
      }
    });
    applyCommitted(saved);
    return true;
  }

  function handleBlur(event: React.FocusEvent) {
    const next = event.relatedTarget;
    if (next instanceof Node && rootRef.current?.contains(next)) return;
    setOpen(false);
    void commit();
  }

  const phoneId = id ? `${id}_phone` : undefined;

  return (
    <div ref={rootRef} className="space-y-2" onBlur={handleBlur}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={id} className="sr-only">
            Payer name
          </Label>
          <div className="relative">
          <Input
            id={id}
            value={name}
            disabled={pending}
            placeholder="Payer name"
            autoComplete="off"
            role="combobox"
            aria-expanded={open && suggestions.length > 0}
            aria-autocomplete="list"
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setName(event.target.value);
              setOpen(true);
              setError(null);
            }}
          />
          {open && suggestions.length > 0 ? (
            <div className="absolute top-full z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md">
              {suggestions.map((payer) => (
                <button
                  key={payer.id}
                  type="button"
                  className="flex w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => linkPayer(payer)}
                >
                  <span className="min-w-0 truncate">{payerLabel(payer)}</span>
                </button>
              ))}
            </div>
          ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={phoneId} className="sr-only">
            Payer phone
          </Label>
          <Input
            id={phoneId}
            type="tel"
            value={phone}
            disabled={pending}
            placeholder="Phone"
            autoComplete="off"
            onChange={(event) => {
              setPhone(event.target.value);
              setError(null);
            }}
          />
        </div>
      </div>
      {sharedWarning ? (
        <p className={cn("text-sm text-muted-foreground")}>{sharedWarning}</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
