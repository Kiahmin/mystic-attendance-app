"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createVenue } from "@/lib/actions/venues";
import type { Venue } from "@/lib/types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VenueSelectProps = {
  id?: string;
  venues: Pick<Venue, "id" | "name" | "is_active">[];
  value: string;
  onChange: (venueId: string) => void;
  onCreated?: (venue: Venue) => void;
  required?: boolean;
  placeholder?: string;
};

export function VenueSelect({
  id,
  venues,
  value,
  onChange,
  onCreated,
  required,
  placeholder = "Select a venue",
}: VenueSelectProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const options = venues.filter(
    (venue) => venue.is_active || venue.id === value
  );

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createVenue(name);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      if (result.venue) {
        onCreated?.(result.venue);
        onChange(result.venue.id);
      }
      setName("");
      setAddOpen(false);
    });
  }

  return (
    <div className="flex gap-2">
      <Select
        value={value || undefined}
        onValueChange={onChange}
        required={required}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((venue) => (
            <SelectItem key={venue.id} value={venue.id}>
              {venue.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        title="Add venue"
        onClick={() => {
          setError(null);
          setAddOpen(true);
        }}
      >
        <Plus className="size-4" />
        <span className="sr-only">Add venue</span>
      </Button>
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Add venue</DialogTitle>
            <DialogDescription>
              Locations such as Stadium or Khatib. Classes and events pick from
              this list.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new_venue_name">Name</Label>
              <Input
                id="new_venue_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Stadium"
                required
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Adding…" : "Add venue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
