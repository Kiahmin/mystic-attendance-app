"use client";

import { useState, useTransition } from "react";
import {
  createStudentGearOrder,
  deleteStudentGearOrder,
  updateStudentRentals,
} from "@/lib/actions/student-gear";
import { formatSingaporeDateTime } from "@/lib/datetime";
import {
  GEAR_ITEM_PRESETS,
  gearOrderItemLabel,
} from "@/lib/gear-utils";
import type { Student, StudentGearOrder } from "@/lib/types";
import { GearOrderStatusButtons } from "@/components/gear/gear-order-controls";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function StudentGearCard({
  student,
  orders,
}: {
  student: Student;
  orders: StudentGearOrder[];
}) {
  const openOrders = orders.filter((order) => order.status !== "given");
  const givenOrders = orders.filter((order) => order.status === "given");

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Rentals and orders</CardTitle>
        <CardDescription>
          Rentals are packed for every class until you turn them off. Purchases
          stay on the bring list until they are marked given.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <RentalForm student={student} />
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-heading text-base font-medium">Purchases</h3>
          <AddOrderForm studentId={student.id} />
          {openOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open purchases.</p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {openOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </ul>
          )}
          {givenOrders.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Given</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {givenOrders.map((order) => (
                  <li key={order.id}>
                    {gearOrderItemLabel(order)}
                    {order.given_at
                      ? ` · ${formatSingaporeDateTime(order.given_at)}`
                      : ""}
                    {order.notes ? ` · ${order.notes}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function RentalForm({ student }: { student: Student }) {
  const [skates, setSkates] = useState(student.needs_rental_skates);
  const [gear, setGear] = useState(student.needs_rental_gear);
  const [note, setNote] = useState(student.rental_note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await updateStudentRentals(student.id, {
            needs_rental_skates: skates,
            needs_rental_gear: gear,
            rental_note: note,
          });
          if (result.error) setError(result.error);
        });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
          <span className="text-sm font-medium">Rental skates</span>
          <Switch
            checked={skates}
            onCheckedChange={setSkates}
            aria-label="Rental skates"
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
          <span className="text-sm font-medium">Rental gear</span>
          <Switch
            checked={gear}
            onCheckedChange={setGear}
            aria-label="Rental gear"
          />
        </label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rental-note">Sizes and details</Label>
        <Textarea
          id="rental-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Skates EU 36, helmet S"
        />
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save rentals"}
      </Button>
    </form>
  );
}

function AddOrderForm({ studentId }: { studentId: string }) {
  const [itemName, setItemName] = useState("");
  const [size, setSize] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await createStudentGearOrder(studentId, {
            item_name: itemName,
            size,
            notes,
          });
          if (result.error) {
            setError(result.error);
            return;
          }
          setItemName("");
          setSize("");
          setNotes("");
        });
      }}
    >
      <div className="flex flex-wrap gap-1.5" aria-label="Common items">
        {GEAR_ITEM_PRESETS.map((preset) => (
          <Button
            key={preset}
            type="button"
            size="xs"
            variant={itemName === preset ? "default" : "outline"}
            onClick={() => setItemName(preset)}
          >
            {preset}
          </Button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
        <div className="space-y-2">
          <Label htmlFor="gear-item-name">Item</Label>
          <Input
            id="gear-item-name"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            placeholder="Skates"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gear-item-size">Size</Label>
          <Input
            id="gear-item-size"
            value={size}
            onChange={(event) => setSize(event.target.value)}
            placeholder="EU 36"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="gear-item-notes">Note</Label>
        <Input
          id="gear-item-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional"
        />
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Adding…" : "Add purchase"}
      </Button>
    </form>
  );
}

function OrderRow({ order }: { order: StudentGearOrder }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const label = gearOrderItemLabel(order);

  return (
    <li className="flex flex-col gap-3 p-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">{label}</p>
        {order.notes ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{order.notes}</p>
        ) : null}
        {error ? (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <GearOrderStatusButtons
          orderId={order.id}
          status={order.status}
          itemLabel={label}
        />
        <Button
          type="button"
          variant="ghost"
          size="xs"
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await deleteStudentGearOrder(order.id);
              if (result.error) setError(result.error);
            });
          }}
        >
          {pending ? "Removing…" : "Remove"}
        </Button>
      </div>
    </li>
  );
}
