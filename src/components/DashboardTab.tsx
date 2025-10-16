"use client";

import { Calendar as CalendarIcon, Clock, TrendingUp } from "lucide-react";
import {
  format,
  startOfDay,
  differenceInCalendarWeeks,
  isSameDay,
  isSameWeek,
} from "date-fns";
import { toast } from "sonner";
import EventCard from "@/components/EventCard";

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
  const now = new Date(); // current time

  // ✅ Calculate current week
  const currentWeek =
    selectedSemester &&
    differenceInCalendarWeeks(
      new Date(),
      new Date(selectedSemester.startDate),
      { weekStartsOn: 1 }
    ) + 1;

  // ✅ Today events — same day + not yet ended
  const todayEvents = events
    .filter((e) => {
      if (!e.eventDate) return false;
      if (e.status && e.status === "completed") return false;

      const endTime = e.endTime ? new Date(e.endTime) : null;
      const endDateTime = new Date(e.eventDate);

      if (endTime) {
        endDateTime.setHours(endTime.getHours(), endTime.getMinutes());
      }

      // Show if event is today and not ended
      return isSameDay(today, e.eventDate) && (!endTime || endDateTime > now);
    })
    .sort((a, b) => {
      const startA = new Date(a.startTime);
      const startB = new Date(b.startTime);
      return startA.getTime() - startB.getTime();
    });

  // ✅ Upcoming events this week — after now
  const upcomingEvents = events
    .filter((e) => {
      if (!e.eventDate) return false;
      if (e.status && e.status === "completed") return false;

      const startTime = e.startTime ? new Date(e.startTime) : null;
      const startDateTime = new Date(e.eventDate);

      if (startTime) {
        startDateTime.setHours(startTime.getHours(), startTime.getMinutes());
      }

      // Must be this week and in the future
      return (
        isSameWeek(e.eventDate, now, { weekStartsOn: 1 }) && startDateTime > now
      );
    })
    .sort((a, b) => {
      const dateDiff = a.eventDate.getTime() - b.eventDate.getTime();
      if (dateDiff !== 0) return dateDiff;

      const startA = new Date(a.startTime);
      const startB = new Date(b.startTime);
      return startA.getTime() - startB.getTime();
    });

  // ✅ Total events in this week
  const thisWeekTotal = events.filter((e) =>
    isSameWeek(e.eventDate, now, { weekStartsOn: 1 })
  ).length;

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
        <StatCard
          title="This Week"
          value={thisWeekTotal}
          icon={<CalendarIcon />}
        />
        <StatCard
          title="Upcoming"
          value={upcomingEvents.length}
          icon={<TrendingUp />}
        />
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
              />
            ))}
          </div>
        ) : (
          <Empty message="No events scheduled for today. Enjoy your free day!" />
        )}
      </Section>

      {/* Upcoming This Week */}
      <Section title="Upcoming This Week">
        {upcomingEvents.length > 0 ? (
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
        )}
      </Section>
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
