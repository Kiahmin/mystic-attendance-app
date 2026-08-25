"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Columns3 } from "lucide-react";
import {
  ColumnFilter,
  SortHeader,
  cycleColumnSort,
  type TableSort,
} from "@/components/admin/table-controls";
import {
  ATTENDANCE_STATUS_LABELS,
  ATTENDEE_SOURCE_LABELS,
  attendanceCreditState,
  formatSessionTime,
} from "@/lib/attendance-utils";
import { formatCalendarDateLong } from "@/lib/datetime";
import type { AttendanceStatus, StudentAttendanceEntry } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;

type StudentAttendanceHistoryProps = {
  entries: StudentAttendanceEntry[];
  isTrial?: boolean;
};

type StatusFilter = AttendanceStatus | "unset";

type OptionalColumn = "coach" | "credit" | "markedBy";

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = (
  Object.keys(ATTENDANCE_STATUS_LABELS) as AttendanceStatus[]
).map((status) => ({ value: status, label: ATTENDANCE_STATUS_LABELS[status] }));

const STATUS_CLASS: Record<AttendanceStatus, string> = {
  present: "bg-primary/15 text-primary",
  absent: "bg-destructive/10 text-destructive",
  no_show: "bg-destructive/10 text-destructive",
};

const OPTIONAL_COLUMN_LABELS: Record<OptionalColumn, string> = {
  coach: "Coach",
  credit: "Credit",
  markedBy: "Marked by",
};

/** Rendered left to right; `null` columns are always visible. */
const COLUMN_LAYOUT: { column: OptionalColumn | null; width: string }[] = [
  { column: null, width: "9.5rem" },
  { column: null, width: "minmax(0,1.7fr)" },
  { column: "coach", width: "minmax(0,1fr)" },
  { column: null, width: "minmax(0,1.2fr)" },
  { column: "credit", width: "minmax(0,1.1fr)" },
  { column: "markedBy", width: "minmax(0,1fr)" },
];

const DEFAULT_SORT: TableSort<"date"> = { column: "date", dir: "desc" };

function StatusPill({
  entry,
  isTrial,
}: {
  entry: StudentAttendanceEntry;
  isTrial: boolean;
}) {
  if (!entry.status) {
    return <span className="text-sm text-muted-foreground">Not marked</span>;
  }

  const showWalkIn = entry.attendeeSource === "walk_in";
  const showOneOff = entry.attendeeSource === "one_off" && !isTrial;
  const declinedWalkIn =
    showWalkIn && entry.status === "absent" && Boolean(entry.decline_reason);

  return (
    <div className="min-w-0 space-y-1">
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
            STATUS_CLASS[entry.status]
          )}
        >
          {ATTENDANCE_STATUS_LABELS[entry.status]}
        </span>
        {showWalkIn ? (
          <Badge variant="warning">
            {ATTENDEE_SOURCE_LABELS.walk_in}
          </Badge>
        ) : null}
        {showOneOff ? (
          <Badge variant="warning">{ATTENDEE_SOURCE_LABELS.one_off}</Badge>
        ) : null}
      </div>
      {declinedWalkIn ? (
        <p className="truncate text-xs text-muted-foreground">
          {entry.decline_reason}
        </p>
      ) : null}
    </div>
  );
}

function CreditCell({ entry }: { entry: StudentAttendanceEntry }) {
  const state = attendanceCreditState(entry);

  if (state === "free") {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  if (state === "uncharged") {
    return (
      <span className="inline-flex h-5 items-center rounded-full bg-warning/15 px-2 text-xs font-medium text-warning">
        Awaiting payment
      </span>
    );
  }

  return (
    <div className="min-w-0">
      <p className="text-sm">1 credit</p>
      {entry.packageName ? (
        <p className="truncate text-xs text-muted-foreground">
          {entry.packageName}
        </p>
      ) : null}
    </div>
  );
}

export function StudentAttendanceHistory({
  entries,
  isTrial = false,
}: StudentAttendanceHistoryProps) {
  const [sort, setSort] = useState<TableSort<"date">>(DEFAULT_SORT);
  const [statusFilters, setStatusFilters] = useState<StatusFilter[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<OptionalColumn[]>([]);
  const [page, setPage] = useState(1);

  function isVisible(column: OptionalColumn) {
    return !hiddenColumns.includes(column);
  }

  const gridTemplate = COLUMN_LAYOUT.filter(
    (slot) => slot.column == null || isVisible(slot.column)
  )
    .map((slot) => slot.width)
    .join(" ");

  const gridStyle = {
    "--attendance-grid": gridTemplate,
  } as CSSProperties;

  const filtered = useMemo(() => {
    const rows = entries.filter((entry) => {
      if (statusFilters.length === 0) return true;
      const value: StatusFilter = entry.status ?? "unset";
      return statusFilters.includes(value);
    });

    return [...rows].sort((a, b) => {
      const byDate = a.sessionDate.localeCompare(b.sessionDate);
      const ascending =
        byDate !== 0 ? byDate : a.startTime.localeCompare(b.startTime);
      return sort.dir === "asc" ? ascending : -ascending;
    });
  }, [entries, statusFilters, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const pageEnd = pageStart + pageRows.length;

  function toggleColumn(column: OptionalColumn) {
    setHiddenColumns((current) =>
      current.includes(column)
        ? current.filter((item) => item !== column)
        : [...current, column]
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-8 text-center">
        <p className="font-medium">No attendance records yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Records appear here once a coach marks this student at check-in.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2 px-4"
              aria-pressed={hiddenColumns.length > 0}
            >
              <Columns3 className="size-4 shrink-0 text-muted-foreground" />
              Columns
              {hiddenColumns.length > 0 ? (
                <Badge variant="secondary">{hiddenColumns.length} hidden</Badge>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuLabel>Show columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(OPTIONAL_COLUMN_LABELS) as OptionalColumn[]).map(
              (column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  checked={!hiddenColumns.includes(column)}
                  onCheckedChange={() => toggleColumn(column)}
                  onSelect={(event) => event.preventDefault()}
                >
                  {OPTIONAL_COLUMN_LABELS[column]}
                </DropdownMenuCheckboxItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border/70 bg-card">
        <div
          className="flex gap-6 border-b border-border/60 bg-muted/50 px-5 py-3.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase lg:grid lg:gap-4 lg:grid-cols-[var(--attendance-grid)]"
          style={gridStyle}
        >
          <SortHeader
            label="Date"
            column="date"
            sort={sort}
            onCycle={() => setSort((current) => cycleColumnSort(current, "date"))}
            unsortedLabel="Sort by date"
            ascLabel="Sorted by date, oldest first. Click to reverse."
            descLabel="Sorted by date, newest first. Click to reverse."
          />
          <span className="hidden lg:inline">Session</span>
          {isVisible("coach") ? (
            <span className="hidden lg:inline">Coach</span>
          ) : null}
          <ColumnFilter
            label="Status"
            options={STATUS_FILTER_OPTIONS}
            selected={statusFilters}
            onChange={(next) => {
              setStatusFilters(next);
              setPage(1);
            }}
          />
          {isVisible("credit") ? (
            <span className="hidden lg:inline">Credit</span>
          ) : null}
          {isVisible("markedBy") ? (
            <span className="hidden lg:inline">Marked by</span>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium">No matching records</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different filter.
            </p>
          </div>
        ) : (
          <div>
            <ul className="divide-y divide-border/60">
              {pageRows.map((entry) => (
                <li
                  key={entry.id}
                  className="grid gap-3 px-5 py-4 lg:items-center lg:gap-4 lg:grid-cols-[var(--attendance-grid)]"
                  style={gridStyle}
                >
                  <div className="min-w-0">
                    <p className="text-sm">
                      {formatCalendarDateLong(entry.sessionDate)}
                    </p>
                    {entry.startTime === "00:00:00" ? null : (
                      <p className="text-xs text-muted-foreground">
                        {formatSessionTime(entry.startTime)}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="truncate text-sm">{entry.sessionName}</p>
                      {entry.sessionKind === "event" ? (
                        <Badge variant="outline">Event</Badge>
                      ) : null}
                    </div>
                  </div>

                  {isVisible("coach") ? (
                    <p className="truncate text-sm">
                      <span className="text-muted-foreground lg:hidden">
                        Coach:{" "}
                      </span>
                      {entry.coachName ?? (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </p>
                  ) : null}

                  <StatusPill entry={entry} isTrial={isTrial} />

                  {isVisible("credit") ? <CreditCell entry={entry} /> : null}

                  {isVisible("markedBy") ? (
                    <p className="truncate text-sm">
                      <span className="text-muted-foreground lg:hidden">
                        Marked by:{" "}
                      </span>
                      {entry.markedByName ?? (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
              <span>
                {`Showing ${pageStart + 1}–${pageEnd} of ${filtered.length} records`}
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={currentPage >= pageCount}
                  aria-label="Next page"
                  onClick={() =>
                    setPage((value) => Math.min(pageCount, value + 1))
                  }
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
