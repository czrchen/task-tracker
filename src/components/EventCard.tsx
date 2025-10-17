"use client";

import { useState } from "react";
import { Clock, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // ✅ nice notification feedback

export default function EventCard({
  event,
  variant = "default",
  showCheckbox,
  onComplete,
  onDelete,
  onEventAdded,
}: {
  event: any;
  variant?: "default" | "compact";
  showCheckbox?: boolean;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEventAdded?: () => void;
}) {
  const [loadingAction, setLoadingAction] = useState(false);

  // ✅ Format time in UTC (matches calendar)
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

  const startStr = formatTime(event.startTime);
  const endStr = formatTime(event.endTime);

  // ✅ Type → color
  const typeColorMap: Record<string, string> = {
    "Tutorial": "bg-tutorial", // 🟡 soft cream (#fbf7e8)
    "Lecturer": "bg-lecturer", // 🔴 soft pink (#fbebeb)
    Task: "bg-task", // 🔵 pastel blue (#e2f1f7)
    Event: "bg-event", // 🫒 olive green (#e9f5e1)
    "Assignment Due": "bg-deadline", // 🔴 solid red (#d32f2f, white text)
    Exam: "bg-deadline", // 🔴 same solid red for exams
  };

  const badgeColor =
    typeColorMap[event.type?.trim()] ??
    "bg-gray-100 text-gray-700 border-gray-300";

  const showCheckboxForType =
    showCheckbox &&
    event.type &&
    (event.type.trim() === "Task" || event.type.trim() === "Assignment Due");

  const isClass =
    event.type === "Tutorial Class" || event.type === "Lecturer Class";

  // ✅ Mark as complete (PATCH API)
  const handleMarkComplete = async () => {
    try {
      setLoadingAction(true);
      const res = await fetch(`/api/modifyEvents/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!res.ok) throw new Error("Failed to mark as complete");

      if (onEventAdded) onEventAdded();

      toast.success("✅ Task marked as completed");
      onComplete?.(event.id);
    } catch (err) {
      toast.error("❌ Failed to update status");
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  // ✅ Delete event (DELETE API)
  const handleDelete = async () => {
    try {
      setLoadingAction(true);
      const res = await fetch(`/api/modifyEvents/${event.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event");

      if (onEventAdded) onEventAdded();

      toast.success("🗑️ Event deleted successfully");
      onDelete?.(event.id);
    } catch (err) {
      toast.error("❌ Failed to delete event");
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <Card
      className={`flex items-center justify-between p-4 ${
        variant === "compact" ? "py-3" : "py-5"
      }`}
    >
      <CardContent className="w-full flex items-center justify-between p-0">
        {/* Left */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-base">
            {isClass
              ? event.courseName ?? "Unnamed Class"
              : event.title ?? "Untitled Event"}
          </h3>

          {isClass && event.courseCode && (
            <p className="text-sm text-muted-foreground">
              ({event.courseCode})
            </p>
          )}

          {!isClass && event.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Clock className="w-4 h-4" />
            {`${startStr} - ${endStr}`}
          </div>

          {isClass && event.room && (
            <p className="text-sm text-muted-foreground mt-1">
              Room: {event.room}
            </p>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Task checkbox */}
          {showCheckboxForType && (
            <input
              type="checkbox"
              className="w-4 h-4 cursor-pointer"
              disabled={loadingAction}
              onChange={handleMarkComplete}
            />
          )}

          {/* Delete button */}
          {!isClass && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-100 hover:text-red-600"
              disabled={loadingAction}
              onClick={handleDelete}
            >
              {loadingAction ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          )}

          {/* Type badge */}
          <span
            className={`text-xs px-2 py-1 rounded-full border capitalize ${badgeColor}`}
          >
            {event.type ?? "Event"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
