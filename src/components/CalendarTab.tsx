"use client";

import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isSameWeek,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [isMobile, setIsMobile] = useState(false);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  // 🧠 Detect mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 850);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // =============================
  // 📅 MONTH + WEEK CALCULATION
  // =============================
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);

  // ✅ Create only current and upcoming weeks in this month
  const weeksInMonth: { start: Date; end: Date }[] = [];
  let weekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const today = new Date();

  while (weekStart <= monthEnd) {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });

    // Only include weeks that end today or later (skip fully past weeks)
    if (weekEnd >= startOfWeek(today, { weekStartsOn: 0 })) {
      weeksInMonth.push({ start: weekStart, end: weekEnd });
    }

    weekStart = addWeeks(weekStart, 1);
  }

  // ✅ Default to current week if within the month, otherwise first available future week
  useEffect(() => {
    const currentWeekIndex = weeksInMonth.findIndex((week) =>
      isSameWeek(today, week.start, { weekStartsOn: 0 })
    );

    if (currentWeekIndex !== -1) {
      setSelectedWeekIndex(currentWeekIndex);
    } else {
      // if all weeks are future, pick the first one
      setSelectedWeekIndex(0);
    }
  }, [currentMonth]);

  // Selected week info
  const currentWeek = weeksInMonth[selectedWeekIndex] || weeksInMonth[0];
  const currentWeekStart = currentWeek.start;
  const currentWeekEnd = currentWeek.end;

  // Filter events for current week
  const weekEvents = events.filter((e) =>
    isSameWeek(e.eventDate, currentWeekStart, { weekStartsOn: 0 })
  );

  // Filter days that actually have events
  const daysWithEvents = Array.from({ length: 7 })
    .map((_, i) => addDays(currentWeekStart, i))
    .filter((day) => weekEvents.some((e) => isSameDay(e.eventDate, day)))
    .sort((a, b) => a.getTime() - b.getTime());

  // Auto-select first available day when switching week
  useEffect(() => {
    if (
      daysWithEvents.length > 0 &&
      !daysWithEvents.some((d) => isSameDay(d, selectedDate!))
    ) {
      setSelectedDate(daysWithEvents[0]);
    }
  }, [weekEvents.length, selectedWeekIndex]);

  // Events for selected day
  const selectedDayEvents = selectedDate
    ? weekEvents.filter((e) => isSameDay(e.eventDate, selectedDate))
    : [];

  // Navigation
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedWeekIndex(0);
  };
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedWeekIndex(0);
  };

  // =============================
  // 📱 MOBILE VIEW
  // =============================
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Month / Year Selector */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Week Selector */}
        <div className="flex items-center justify-between">
          <Select
            value={selectedWeekIndex.toString()}
            onValueChange={(val) => setSelectedWeekIndex(Number(val))}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Select Week" />
            </SelectTrigger>
            <SelectContent>
              {weeksInMonth.map((week, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  ({format(week.start, "d MMM")}–{format(week.end, "d MMM")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AddEventDialog
            selectedSemester={selectedSemester}
            onEventAdded={onEventAdded}
            defaultDate={selectedDate}
          />
        </div>

        {/* Week Tabs — only days that have events */}
        {daysWithEvents.length > 0 ? (
          <div
            className="grid border-b border-border pb-1 gap-1"
            style={{
              gridTemplateColumns: `repeat(${daysWithEvents.length}, minmax(0, 1fr))`,
            }}
          >
            {daysWithEvents.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "py-2 rounded-lg font-medium transition text-sm flex flex-col items-center justify-center",
                  isSameDay(day, selectedDate!)
                    ? "bg-black text-white"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >
                <span className="font-semibold">{format(day, "EEE")}</span>
                <span className="text-[11px] opacity-80">
                  {format(day, "d")}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No events this week
          </p>
        )}

        {/* Events for Selected Day */}
        {daysWithEvents.length > 0 && (
          <div>
            <h3 className="text-base font-bold mb-2">
              {format(selectedDate!, "EEEE, MMM d")}
            </h3>
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    variant="compact"
                    showCheckbox
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No events for this day
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // =============================
  // 💻 DESKTOP VIEW (full calendar)
  // =============================
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

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

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const dayEvents = events.filter((e) =>
          isSameDay(e.eventDate, cloneDay)
        );

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

            {/* ✅ color-coded event labels */}
            <div className="space-y-1">
              {/* ✅ Sort so Assignment Due & Exam appear first */}
              {dayEvents
                .sort((a, b) => {
                  const priority = (type: string) =>
                    type === "Assignment Due" ? 1 : type === "Exam" ? 2 : 3;
                  return priority(a.type) - priority(b.type);
                })
                .slice(0, 2)
                .map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-xs p-1 rounded truncate border",
                      event.type === "Tutorial"
                        ? "bg-tutorial"
                        : event.type === "Lecturer"
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

  const selectedDateEvents = selectedDate
    ? events.filter((e) => isSameDay(e.eventDate, selectedDate))
    : [];

  return (
    <div className="grid lg:grid-cols-[1fr,400px] gap-6">
      {/* Calendar Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <AddEventDialog
              selectedSemester={selectedSemester}
              onEventAdded={onEventAdded}
              defaultDate={selectedDate}
            />
          </div>
        </div>

        {renderDays()}
        {renderCells()}
      </section>

      {/* Sidebar */}
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
