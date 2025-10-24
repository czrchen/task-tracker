"use client";

import { useState, useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import { format, differenceInCalendarWeeks } from "date-fns";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CompletedTab({
  events,
  selectedSemester,
}: {
  events: any[];
  selectedSemester: any;
}) {
  // ✅ Only show completed events
  const completedEvents = events.filter((e) => e.status === "completed");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // 🗓️ Month list
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

  const currentStudyWeek =
    selectedSemester &&
    differenceInCalendarWeeks(
      new Date(),
      new Date(selectedSemester.startDate),
      { weekStartsOn: 0 }
    ) + 1;

  // 🧠 Extract available years from completed events dynamically
  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(completedEvents.map((e) => new Date(e.eventDate).getFullYear()))
    ).sort((a, b) => b - a); // descending
    return years;
  }, [completedEvents]);

  // 🧩 Filter logic
  const filtered = completedEvents.filter((e) => {
    const eventDate = new Date(e.eventDate);
    const matchSearch = e.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchMonth =
      selectedMonth === "all" || format(eventDate, "MMMM") === selectedMonth;

    const matchYear =
      selectedYear === "all" ||
      eventDate.getFullYear().toString() === selectedYear;

    return matchSearch && matchMonth && matchYear;
  });

  return (
    <main className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <CheckCircle2 className="text-primary" /> Completed Tasks
      </h1>

      {/* Filters */}
      <div className="grid md:grid-cols-[2fr,1fr,1fr] gap-4 mb-6">
        {/* 🔍 Search */}
        <Input
          placeholder="Search by event name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* 🗓️ Month + Year side by side */}
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Month" />
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

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ✅ Completed Events List */}
      {filtered.length > 0 ? (
        <div className="max-h-[350px] overflow-y-auto pr-2">
          <div className="space-y-3">
            {filtered.map((event, index) => (
              <div
                key={event.id ?? index}
                className="p-3 flex items-center gap-3 rounded-xl border border-border bg-card shadow-sm"
              >
                {/* 📅 Date inside box */}
                <div className="flex-shrink-0 text-center border-r border-border pr-3">
                  <div className="text-2xl font-bold text-primary">
                    {format(event.eventDate, "d")}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase">
                    {format(event.eventDate, "MMM")}
                  </div>
                </div>

                {/* 📋 Event details */}
                <div className="flex-1 opacity-75">
                  <EventCard
                    event={event}
                    variant="compact"
                  />
                </div>

                {/* ✅ Hide icon on mobile */}
                <CheckCircle2 className="w-6 h-6 text-primary hidden md:block" />
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
