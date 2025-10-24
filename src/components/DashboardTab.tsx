"use client";

import { Calendar as CalendarIcon, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  format,
  startOfDay,
  differenceInCalendarWeeks,
  isSameDay,
  isSameWeek,
} from "date-fns";
import EventCard from "@/components/EventCard";
import Upcoming from "@/components/Upcoming"; // updated import

export default function DashboardTab({
  user,
  selectedSemester,
  events,
  onEventAdded,
}: {
  user: any;
  selectedSemester: any;
  events: any[];
  onEventAdded?: () => void;
}) {
  const today = startOfDay(new Date());
  const now = new Date(); // current UTC time
  const [localEvents, setLocalEvents] = useState(events);

  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  const formatUTCTime = (dateObj: Date | null) => {
    if (!dateObj) return "No time set";
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    const displayMin = minutes.toString().padStart(2, "0");
    return `${displayHour}:${displayMin} ${ampm}`;
  };

  // 🕒 Helper — use UTC just like CalendarTab
  const getEndDateTimeUTC = (event: any) => {
    if (!event.endTime) return null;
    const endDateTime = new Date(event.eventDate);
    const end = new Date(event.endTime);
    endDateTime.setUTCHours(end.getUTCHours(), end.getUTCMinutes());
    return endDateTime;
  };

  const getStartDateTimeUTC = (event: any) => {
    if (!event.startTime) return null;
    const startDateTime = new Date(event.eventDate);
    const start = new Date(event.startTime);
    startDateTime.setUTCHours(start.getUTCHours(), start.getUTCMinutes());
    return startDateTime;
  };

  // ✅ Calculate current week
  const currentWeek =
    selectedSemester &&
    differenceInCalendarWeeks(
      new Date(),
      new Date(selectedSemester.startDate),
      { weekStartsOn: 0 }
    ) + 1;

  // ✅ Today events — same logic as calendar (UTC)
  const todayEvents = localEvents
    .filter((e) => {
      if (!e.eventDate) return false;
      if (e.status === "completed") return false;

      const endDateTime = getEndDateTimeUTC(e);
      // same-day check uses local but consistent to e.eventDate (which is UTC-based)
      return (
        isSameDay(today, e.eventDate) && (!endDateTime || endDateTime > now)
      );
    })
    .sort((a, b) => {
      const startA = getStartDateTimeUTC(a);
      const startB = getStartDateTimeUTC(b);
      if (!startA || !startB) return 0;
      return startA.getTime() - startB.getTime();
    });

  // ✅ Upcoming events this week — same UTC comparison
  const upcomingEvents = localEvents
    .filter((e) => {
      if (!e.eventDate) return false;
      if (e.status === "completed") return false;

      const startDateTime = getStartDateTimeUTC(e);
      return (
        isSameWeek(e.eventDate, now, { weekStartsOn: 0 }) &&
        startDateTime &&
        startDateTime > now
      );
    })
    .sort((a, b) => {
      const dateDiff = a.eventDate.getTime() - b.eventDate.getTime();
      if (dateDiff !== 0) return dateDiff;
      const startA = getStartDateTimeUTC(a);
      const startB = getStartDateTimeUTC(b);
      if (!startA || !startB) return 0;
      return startA.getTime() - startB.getTime();
    });

  // 🧾 Breakdown by type for this week
  const thisWeekEvents = localEvents.filter((e) =>
    isSameWeek(e.eventDate, now, { weekStartsOn: 0 })
  );

  const typeCounts = thisWeekEvents.reduce((acc: any, e: any) => {
    const type = e.type || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // ✅ Triggered only after successful PATCH (from EventCard)
  const handleCompleteTask = (eventId: string) => {
    setLocalEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "completed" } : e))
    );
  };

  // ✅ Triggered only after successful DELETE (from EventCard)
  const handleDeleteTask = (eventId: string) => {
    setLocalEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Welcome back {user?.name || "Student"}!
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              {format(today, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
        </div>

        {/* Semester info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Current Semester:</p>
            <span className="text-sm font-medium bg-accent px-3 py-1 rounded-md border">
              {selectedSemester?.name ?? "Loading..."}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Week{" "}
            <span className="font-semibold text-foreground">
              {currentWeek ?? "-"}
            </span>{" "}
            of {selectedSemester?.name ?? "N/A"}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Today's Events"
          value={todayEvents.length}
          icon={<Clock />}
        />
        <WeekBreakdownCard
          title="This Week"
          counts={typeCounts}
          icon={<CalendarIcon />}
        />

        <div className="p-6 rounded-xl gradient-card border border-border shadow-card">
          <Tabs defaultValue="due" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-3">
              <TabsTrigger value="due" className="text-xs">
                Next Assignment
              </TabsTrigger>
              <TabsTrigger value="exam" className="text-xs">
                Exam
              </TabsTrigger>
            </TabsList>

            {/* 📝 Next Assignment Tab */}
            <TabsContent value="due">
              {(() => {
                const nearestAssignment = localEvents
                  .filter((e) => e.type === "Due" && e.status !== "completed")
                  .sort(
                    (a, b) =>
                      new Date(a.eventDate).getTime() -
                      new Date(b.eventDate).getTime()
                  )[0];

                return nearestAssignment ? (
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {nearestAssignment.title || "Assignment Due"}
                    </h3>
                    <p className="text-2xl font-bold text-foreground">
                      {format(nearestAssignment.eventDate, "d MMM")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatUTCTime(getEndDateTimeUTC(nearestAssignment))}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-sm">
                    No upcoming assignments
                  </div>
                );
              })()}
            </TabsContent>

            {/* 🎓 Exam Tab */}
            <TabsContent value="exam">
              {(() => {
                const nearestExam = localEvents
                  .filter((e) => e.type === "Exam")
                  .sort(
                    (a, b) =>
                      new Date(a.eventDate).getTime() -
                      new Date(b.eventDate).getTime()
                  )[0];

                return nearestExam ? (
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {nearestExam.title || "Exam"}
                    </h3>
                    <p className="text-2xl font-bold text-foreground">
                      {format(nearestExam.eventDate, "d MMM")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getStartDateTimeUTC(nearestExam)
                        ? `${formatUTCTime(
                            getStartDateTimeUTC(nearestExam)
                          )} - ${formatUTCTime(getEndDateTimeUTC(nearestExam))}`
                        : "No time set"}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-sm">
                    No upcoming exams
                  </div>
                );
              })()}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Today's Schedule */}
      <Section title="Today's Schedule">
        {todayEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showCheckbox
                onEventAdded={onEventAdded}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <Empty message="No events scheduled for today. Enjoy your free day!" />
        )}
      </Section>

      {/* Upcoming This Week */}
      {/* <Section title="Upcoming This Week"> */}
      {/* {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {format(event.eventDate, "d")}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase">
                    {format(event.eventDate, "EEE")}
                  </div>
                </div>
                <div className="flex-1">
                  <EventCard
                    event={event}
                    variant="compact"
                    showCheckbox
                    onEventAdded={onEventAdded}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty message="No upcoming events this week" />
        )} */}
      <Upcoming
        events={events}
        onEventAdded={onEventAdded}
        onComplete={handleCompleteTask}
        onDelete={handleDeleteTask}
        localEvents={localEvents}
        setLocalEvents={setLocalEvents}
      />
      {/* </Section> */}
    </div>
  );
}

// 🔹 Helper components
function StatCard({ title, value, icon }: any) {
  return (
    <div className="p-6 rounded-xl gradient-card border border-border shadow-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-primary">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function WeekBreakdownCard({
  title,
  counts,
  icon,
}: {
  title: string;
  counts: Record<string, number>;
  icon: any;
}) {
  const typeLabels: Record<string, string> = {
    "Lecturer Class": "Lecture",
    "Tutorial Class": "Tutorial",
    Due: "Due",
    Task: "Task",
    Event: "Event",
    Exam: "Exam",
  };

  const typeColors: Record<string, string> = {
    Tutorial: "text-[#ef3b68]", // matches .bg-tutorial (pink/red text)
    Lecturer: "text-[#a48926]", // matches .bg-lecturer (gold text)
    Task: "text-[#1e3a8a]", // matches .bg-task (deep navy)
    Event: "text-[#77aa63]", // matches .bg-event (olive green)
    Due: "text-[#d34b4b]", // matches .bg-deadline (maroon)
    Exam: "text-[#d34b4b]", // also maroon for exams
  };

  const activeTypes = Object.entries(counts).filter(([_, count]) => count > 0);

  return (
    <div className="p-6 rounded-xl gradient-card border border-border shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-black">{title}</h3>
        <div className="text-primary">{icon}</div>
      </div>

      {activeTypes.length > 0 ? (
        <ul className="space-y-1">
          {activeTypes.map(([type, count]) => (
            <li
              key={type}
              className={`flex items-center justify-between text-sm ${
                typeColors[type] || "text-foreground"
              }`}
            >
              <span className="font-semibold">{typeLabels[type] || type}</span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">No events this week</p>
      )}
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-primary rounded-full" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Empty({ message }: any) {
  return (
    <div className="p-12 text-center rounded-xl border-2 border-dashed border-border bg-accent/20">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
