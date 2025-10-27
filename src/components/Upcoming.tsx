"use client";

import { useState } from "react";
import { isSameDay, isSameWeek, format } from "date-fns";
import { cn } from "@/lib/utils";
import EventCard from "@/components/EventCard";

// 📅 Upcoming This Week Tabbed Component
export default function Upcoming({
  events,
  localEvents,
  setLocalEvents,
  onEventAdded,
  onComplete,
  onDelete,
}: {
  events: any[];
  localEvents: any[];
  setLocalEvents: React.Dispatch<React.SetStateAction<any[]>>;
  onEventAdded?: () => void;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const now = new Date();

  // 🗓️ Days array (Sunday-first)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // 🕒 Merge eventDate + startTime (UTC-safe)
  function getStartDateTimeUTC(event: any) {
    if (!event.startTime || !event.eventDate) return null;
    const startDateTime = new Date(event.eventDate);
    const start = new Date(event.startTime);
    startDateTime.setUTCHours(start.getUTCHours(), start.getUTCMinutes());
    return startDateTime;
  }

  // 🧩 Group + sort events by weekday (only current week)
  const eventsByDay = daysOfWeek.map((_, dayIndex) =>
    localEvents
      .filter(
        (e: any) =>
          isSameWeek(e.eventDate, now, { weekStartsOn: 0 }) &&
          new Date(e.eventDate).getDay() === dayIndex
      )
      // ✅ Sort each day's events chronologically
      .sort((a, b) => {
        const startA = getStartDateTimeUTC(a);
        const startB = getStartDateTimeUTC(b);
        if (!startA || !startB) return 0;
        return startA.getTime() - startB.getTime();
      })
  );

  // ✅ Triggered only after successful PATCH (from EventCard)
  const handleCompleteTask = (eventId: string) => {
    setLocalEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "completed" } : e))
    );
  };

  // ✅ Triggered only after successful DELETE (from EventCard)
  const handleDeleteTask = (eventId: string) => {
    setLocalEvents((prev) => prev.filter((e) => e.id !== eventId)); // ✅ update state
  };

  // ✅ Filter out empty days (only keep days with at least one event)
  const activeDays = daysOfWeek
    .map((day, i) => ({ day, index: i, count: eventsByDay[i].length }))
    .filter((d) => d.count > 0);

  // Default tab = today's day if it has events, otherwise first active day
  const todayIndex = activeDays.findIndex((d) => d.index === now.getDay());
  const [selectedDay, setSelectedDay] = useState<number>(
    todayIndex !== -1 ? activeDays[todayIndex].index : activeDays[0]?.index
  );

  const selectedDayEvents = eventsByDay[selectedDay] || [];

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-primary rounded-full" />
        Upcoming This Week
      </h2>

      {/* 🧭 Tabs — only days that have events */}
      {activeDays.length > 0 ? (
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {activeDays.map(({ day, index }) => (
            <button
              key={day}
              onClick={() => setSelectedDay(index)}
              className={cn(
                "flex-1 min-w-[70px] py-2 rounded-md text-sm font-medium border transition-all relative",
                selectedDay === index
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-accent"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          No events this week
        </p>
      )}

      {/* 📋 Selected Day Events */}
      {selectedDayEvents.length > 0 ? (
        <div className="space-y-3">
          {/* 🗓️ Show the date header ONCE */}
          <div className="flex-shrink-0 text-center w-14 sm:w-16 px-1 sm:px-2 mx-auto">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {format(selectedDayEvents[0].eventDate, "d")}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">
              {format(selectedDayEvents[0].eventDate, "MMMM")}
            </div>
          </div>

          {/* 📋 Then render the event cards */}
          {selectedDayEvents.map((event: any) => (
            <div key={event.id} className="flex items-center gap-3">
              <div className="flex-1">
                <EventCard
                  event={event}
                  variant="compact"
                  showCheckbox
                  onEventAdded={onEventAdded}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No events for this day
        </div>
      )}
    </section>
  );
}
