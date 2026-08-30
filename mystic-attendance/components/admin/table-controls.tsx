"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type SortDir = "asc" | "desc";

export type TableSort<TColumn extends string> = {
  column: TColumn;
  dir: SortDir;
};

export function cycleColumnSort<TColumn extends string>(
  current: TableSort<TColumn>,
  column: TColumn
): TableSort<TColumn> {
  if (current.column !== column) return { column, dir: "asc" };
  return { column, dir: current.dir === "asc" ? "desc" : "asc" };
}

export function SortHeader<TColumn extends string>({
  label,
  column,
  sort,
  onCycle,
  unsortedLabel,
  ascLabel,
  descLabel,
}: {
  label: string;
  column: TColumn;
  sort: TableSort<TColumn>;
  onCycle: () => void;
  unsortedLabel: string;
  ascLabel: string;
  descLabel: string;
}) {
  const active = sort.column === column ? sort.dir : null;
  const Icon =
    active === "asc" ? ArrowUp : active === "desc" ? ArrowDown : ArrowUpDown;
  const ariaSort =
    active === "asc" ? "ascending" : active === "desc" ? "descending" : "none";

  return (
    <span role="columnheader" aria-sort={ariaSort} className="inline-flex">
      <button
        type="button"
        onClick={onCycle}
        aria-label={
          active == null ? unsortedLabel : active === "asc" ? ascLabel : descLabel
        }
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
          active ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
        <Icon className="size-3.5" />
      </button>
    </span>
  );
}

export function FilterCheckbox({
  checked,
  label,
  onToggle,
  className,
}: {
  checked: boolean | "indeterminate";
  label: string;
  onToggle: () => void;
  className?: string;
}) {
  const isOn = checked === true;
  const isIndeterminate = checked === "indeterminate";

  return (
    <DropdownMenuCheckboxItem
      checked={checked}
      onCheckedChange={onToggle}
      onSelect={(event) => event.preventDefault()}
      className={cn(
        "pr-2 pl-2 [&_[data-slot=dropdown-menu-checkbox-item-indicator]]:hidden",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-[4px] border",
          isOn || isIndeterminate
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 bg-background"
        )}
      >
        {isOn ? <Check className="size-3" /> : null}
        {isIndeterminate ? <Minus className="size-3" /> : null}
      </span>
      {label}
    </DropdownMenuCheckboxItem>
  );
}

export function ColumnFilter<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  const selectedSet = new Set(selected);
  const allSelected = selected.length === options.length;
  const someSelected = selected.length > 0 && !allSelected;
  const filtered = someSelected;

  function toggle(value: T) {
    onChange(
      selectedSet.has(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  }

  function toggleSelectAll() {
    onChange(allSelected ? [] : options.map((option) => option.value));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
            filtered ? "text-foreground" : "text-muted-foreground"
          )}
          aria-label={`Filter ${label}`}
        >
          {label}
          {filtered ? (
            <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
              {selected.length}
            </Badge>
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Select one or more</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <FilterCheckbox
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          label="Select all"
          onToggle={toggleSelectAll}
        />
        <DropdownMenuSeparator />
        {options.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={selectedSet.has(option.value)}
            label={option.label}
            onToggle={() => toggle(option.value)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
