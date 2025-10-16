"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CompletedTab({ events }: { events: any[] }) {
  // ✅ Only show completed events
  const completedEvents = events.filter((e) => e.status === "completed");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const filtered = completedEvents.filter((e) => {
    const matchSearch = e.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchMonth =
      selectedMonth === "all" ||
      format(new Date(e.eventDate), "MMMM") === selectedMonth;

    return matchSearch && matchMonth;
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <CheckCircle2 className="text-primary" /> Completed Tasks
      </h1>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Input
          placeholder="Search by event name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* 🗓️ Filter by Month */}
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Completed Events List (max 10 visible, scrollable) */}
      {filtered.length > 0 ? (
        <div className="max-h-[350px] overflow-y-auto pr-2">
          <div className="space-y-3">
            {filtered.map((event, index) => (
              <div key={event.id ?? index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {format(event.eventDate, "d")}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase">
                    {format(event.eventDate, "MMM")}
                  </div>
                </div>
                <div className="flex-1 opacity-75">
                  <EventCard event={event} variant="compact" />
                </div>
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border-2 border-dashed border-border bg-accent/20">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No completed tasks found</p>
        </div>
      )}
    </main>
  );
}
