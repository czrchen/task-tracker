"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EventCard from "@/components/EventCard";
import AddEventDialog from "@/components/AddEventDialog";

export default function CalendarTab({
  selectedSemester,
  events,
  onEventAdded,
}: {
  selectedSemester: any;
  events: any[];
  onEventAdded?: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // 🕒 Helper to format event times
  const formatTime = (dateObj: any) => {
    if (!dateObj) return "-";
    const d = new Date(dateObj);
    const hours = d.getUTCHours();
    const minutes = d.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    const displayMin = minutes.toString().padStart(2, "0");
    return `${displayHour}:${displayMin} ${ampm}`;
  };

  // 🗓️ Month setup
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // 🔁 Navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // ✅ Header
  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-foreground">
        {format(currentMonth, "MMMM yyyy")}
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
          {format(currentMonth, "MMMM yyyy")}
        </Button>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <AddEventDialog
          selectedSemester={selectedSemester}
          onEventAdded={onEventAdded}
        />
      </div>
    </div>
  );

  // ✅ Days Row
  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  // ✅ Calendar Cells
  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        // ✅ Include events (except completed) and sort by priority
        const dayEvents = events
          .filter(
            (e) =>
              isSameDay(e.eventDate, cloneDay) &&
              (e.status === undefined || e.status !== "completed")
          )
          .sort((a, b) => {
            const priority = (type: string) => {
              if (type === "Assignment Due") return 1;
              if (type === "Exam") return 2;
              return 3; // others follow normal time order
            };

            const pa = priority(a.type);
            const pb = priority(b.type);
            if (pa !== pb) return pa - pb;

            // Same priority → sort by start time
            const startA = a.startTime ? new Date(a.startTime).getTime() : 0;
            const startB = b.startTime ? new Date(b.startTime).getTime() : 0;
            return startA - startB;
          });

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "min-h-[100px] p-2 rounded-lg border transition cursor-pointer",
              !isSameMonth(day, monthStart)
                ? "bg-muted/30 text-muted-foreground"
                : "bg-card hover:border-primary/50 hover:shadow",
              isSameDay(day, selectedDate!)
                ? "ring-2 ring-primary border-primary shadow-sm"
                : "",
              isToday(day) ? "bg-primary/5" : ""
            )}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={cn(
                  "text-sm font-semibold",
                  isToday(day)
                    ? "w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    : ""
                )}
              >
                {formattedDate}
              </span>
              {dayEvents.length > 0 && (
                <span className="text-xs font-medium text-primary">
                  {dayEvents.length}
                </span>
              )}
            </div>

            <div className="space-y-1">
              {dayEvents.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "text-xs p-1 rounded truncate border border-primary/20",
                    event.type === "Tutorial Class"
                      ? "bg-tutorial"
                      : event.type === "Lecturer Class"
                      ? "bg-lecturer"
                      : event.type === "Task"
                      ? "bg-task"
                      : event.type === "Event"
                      ? "bg-event"
                      : event.type === "Assignment Due"
                      ? "bg-deadline"
                      : event.type === "Exam"
                      ? "bg-deadline"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  )}
                >
                  {`${formatTime(
                    event.startTime ? event.startTime : event.endTime
                  )} ${event.courseName || event.title}`}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-2">{rows}</div>;
  };

  // ✅ Events of selected date
  const selectedDateEvents = selectedDate
    ? events.filter(
        (e) =>
          isSameDay(e.eventDate, selectedDate) &&
          (e.status === undefined || e.status !== "completed")
      )
    : [];

  return (
    <div className="grid lg:grid-cols-[1fr,400px] gap-6">
      {/* Calendar Section */}
      <section>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </section>

      {/* Sidebar with selected date events */}
      <aside className="lg:sticky lg:top-24 h-fit">
        <div className="p-6 rounded-xl gradient-card border border-border shadow-card">
          <h2 className="text-xl font-bold mb-4">
            {selectedDate
              ? format(selectedDate, "MMMM d, yyyy")
              : "Select a date"}
          </h2>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="compact"
                  showCheckbox
                  onEventAdded={onEventAdded}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No events scheduled</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
