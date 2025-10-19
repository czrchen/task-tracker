"use client";

import { useEffect, useState } from "react";
import DashboardTab from "@/components/DashboardTab";
import CalendarTab from "@/components/CalendarTab";
import CompletedTab from "@/components/CompletedTab";
import { Calendar, LayoutDashboard, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { set } from "date-fns";

// 🧠 Helper — generate all real calendar occurrences for a CourseEvent
function generateEventOccurrences(event: any, semester: any) {
  const occurrences: any[] = [];

  const semesterStart = new Date(semester.startDate);
  const semesterEnd = new Date(semester.endDate);

  // Total number of weeks in semester
  const totalWeeks =
    Math.ceil(
      (semesterEnd.getTime() - semesterStart.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    ) + 1;

  // If no weeksActive → assume every week
  const activeWeeks =
    event.weeksActive && event.weeksActive.length > 0
      ? event.weeksActive
      : Array.from({ length: totalWeeks }, (_, i) => i + 1);

  for (let week = 0; week < totalWeeks; week++) {
    const currentWeekStart = new Date(semesterStart);
    currentWeekStart.setDate(currentWeekStart.getDate() + week * 7);

    const weekNumber = week + 1;
    if (!activeWeeks.includes(weekNumber)) continue;

    const eventDate = new Date(currentWeekStart);
    eventDate.setDate(eventDate.getDate() + (event.dayOfWeek - 1));

    if (eventDate >= semesterStart && eventDate <= semesterEnd) {
      occurrences.push({
        ...event,
        eventDate,
      });
    }
  }

  return occurrences;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<any | null>(null);
  const [eventsForDashboard, setEventsForDashboard] = useState<any[]>([]);
  const [eventsForCalendar, setEventsForCalendar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // 🔁 Dashboard → Only future events
  const fetchDashboardEvents = async () => {
    try {
      const [userRes, semesterRes] = await Promise.all([
        fetch("/api/user/1"),
        fetch("/api/semesters"),
      ]);

      const userData = await userRes.json();
      const semesters = await semesterRes.json();
      const semesterToUse = userData.semester || semesters[0];
      setUser(userData);
      setSelectedSemester(semesterToUse);

      const semesterId = semesterToUse?.id;
      if (!semesterId) {
        setEventsForDashboard([]);
        return;
      }

      const [resCourse, resCustom] = await Promise.all([
        fetch(`/api/events?semesterId=${semesterId}`),
        fetch(`/api/addEvents?semesterId=${semesterId}`),
      ]);

      const courseData = await resCourse.json();
      const customData = await resCustom.json();

      const now = new Date();

      // 🧩 Generate course event dates
      const allOccurrences = courseData.flatMap((eventsForDashboard: any) =>
        generateEventOccurrences(eventsForDashboard, semesterToUse)
      );

      const normalizedCourseEvents = allOccurrences.map((e: any) => ({
        id: e.id,
        title: e.courseName,
        type: e.type,
        eventDate: new Date(e.eventDate),
        startTime: e.startTime ? new Date(e.startTime) : null,
        endTime: e.endTime ? new Date(e.endTime) : null,
        courseName: e.courseName,
        courseCode: e.courseCode,
        room: e.room,
      }));

      const normalizedCustomEvents = customData.map((e: any) => ({
        id: e.id,
        title: e.title,
        type: e.type,
        eventDate: new Date(e.eventDate),
        startTime: e.startTime ? new Date(e.startTime) : null,
        endTime: e.endTime ? new Date(e.endTime) : null,
        description: e.description,
        status: e.status,
      }));

      const combined = [...normalizedCourseEvents, ...normalizedCustomEvents];

      // ✅ Only future events
      const filtered = combined.filter((eventsForDashboard) => {
        const eventDateTime = new Date(eventsForDashboard.eventDate);
        if (eventsForDashboard.endTime)
          eventDateTime.setHours(
            eventsForDashboard.endTime.getUTCHours(),
            eventsForDashboard.endTime.getUTCMinutes()
          );
        else if (eventsForDashboard.startTime)
          eventDateTime.setHours(
            eventsForDashboard.startTime.getUTCHours(),
            eventsForDashboard.startTime.getUTCMinutes()
          );
        return eventDateTime >= now;
      });

      setEventsForDashboard(filtered);
    } catch (err) {
      console.error("❌ Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Calendar → Include past events except Tutorial/Lecturer
  const fetchCalendarEvents = async () => {
    try {
      const [userRes, semesterRes] = await Promise.all([
        fetch("/api/user/1"),
        fetch("/api/semesters"),
      ]);

      const userData = await userRes.json();
      const semesters = await semesterRes.json();
      const semesterToUse = userData.semester || semesters[0];
      setUser(userData);
      setSelectedSemester(semesterToUse);

      const semesterId = semesterToUse?.id;
      if (!semesterId) {
        setEventsForCalendar([]);
        return;
      }

      const [resCourse, resCustom] = await Promise.all([
        fetch(`/api/events?semesterId=${semesterId}`),
        fetch(`/api/addEvents?semesterId=${semesterId}`),
      ]);

      const courseData = await resCourse.json();
      const customData = await resCustom.json();

      const now = new Date();

      const allOccurrences = courseData.flatMap((eventsForCalendar: any) =>
        generateEventOccurrences(eventsForCalendar, semesterToUse)
      );

      const normalizedCourseEvents = allOccurrences.map((e: any) => ({
        id: e.id,
        title: e.courseName,
        type: e.type,
        eventDate: new Date(e.eventDate),
        startTime: e.startTime ? new Date(e.startTime) : null,
        endTime: e.endTime ? new Date(e.endTime) : null,
        courseName: e.courseName,
        courseCode: e.courseCode,
        room: e.room,
      }));

      const normalizedCustomEvents = customData.map((e: any) => ({
        id: e.id,
        title: e.title,
        type: e.type,
        eventDate: new Date(e.eventDate),
        startTime: e.startTime ? new Date(e.startTime) : null,
        endTime: e.endTime ? new Date(e.endTime) : null,
        description: e.description,
        status: e.status,
      }));

      const combined = [...normalizedCourseEvents, ...normalizedCustomEvents];

      // ✅ Include past events except classes
      const filtered = combined.filter((event) => {
        const eventDateTime = new Date(event.eventDate);
        if (event.endTime)
          eventDateTime.setHours(
            event.endTime.getUTCHours(),
            event.endTime.getUTCMinutes()
          );
        else if (event.startTime)
          eventDateTime.setHours(
            event.startTime.getUTCHours(),
            event.startTime.getUTCMinutes()
          );

        const isClass = event.type === "Tutorial" || event.type === "Lecturer";
        return eventDateTime >= now || !isClass;
      });

      setEventsForCalendar(filtered);
    } catch (err) {
      console.error("❌ Failed to fetch calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  const firstfetch = async () => {
    try {
      setLoading(true);
      await fetchDashboardEvents();
      await fetchCalendarEvents();
    } catch (error) {
      console.error("Error in firstfetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    firstfetch();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] text-muted-foreground">
        Loading dashboard...
      </div>
    );

  return (
    <main className="container mx-auto px-4 pb-24">
      {" "}
      {/* 👈 padding bottom for mobile nav */}
      {/* ✅ Desktop Navigation */}
      <div className="hidden md:block border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 mb-8 -mx-4">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-elegant">
              <Calendar className="w-5 h-5 text-black-400" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Hazel&apos;s
            </h1>
          </div>

          {/* Desktop Tabs */}
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition",
                activeTab === "dashboard"
                  ? "bg-primary text-primary-foreground shadow-elegant"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("calendar")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition",
                activeTab === "calendar"
                  ? "bg-primary text-primary-foreground shadow-elegant"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition",
                activeTab === "completed"
                  ? "bg-primary text-primary-foreground shadow-elegant"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </button>
          </div>
        </div>
      </div>
      {/* ✅ Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border z-50">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex flex-col items-center text-xs transition",
              activeTab === "dashboard"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-6 h-6 mb-1" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={cn(
              "flex flex-col items-center text-xs transition",
              activeTab === "calendar"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="w-6 h-6 mb-1" />
            Calendar
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={cn(
              "flex flex-col items-center text-xs transition",
              activeTab === "completed"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <CheckCircle2 className="w-6 h-6 mb-1" />
            Done
          </button>
        </div>
      </div>
      {/* ✅ Tab Content */}
      {activeTab === "dashboard" && (
        <DashboardTab
          user={user}
          selectedSemester={selectedSemester}
          events={eventsForDashboard}
          onEventAdded={() => {
            fetchDashboardEvents(); // ✅ refresh events
            fetchCalendarEvents();
          }}
        />
      )}
      {activeTab === "calendar" && (
        <CalendarTab
          selectedSemester={selectedSemester}
          events={eventsForCalendar}
          onEventAdded={() => {
            fetchDashboardEvents(); // ✅ refresh events
            fetchCalendarEvents();
          }}
        />
      )}
      {activeTab === "completed" && <CompletedTab events={eventsForCalendar} />}
    </main>
  );
}
