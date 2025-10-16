"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AddEventDialog({
  selectedSemester,
  onEventAdded,
}: {
  selectedSemester?: any;
  onEventAdded?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const eventTypes = ["Task", "Event", "Assignment Due", "Exam"];

  // ✅ Helper — add UTC offset to counteract backend's timezone conversion
  function buildLocalDateTime(date: string, time: string) {
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    // Create date and get timezone offset in milliseconds
    const localDate = new Date(year, month - 1, day, hours, minutes, 0);
    const offsetMs = localDate.getTimezoneOffset() * 60 * 1000;

    // Adjust by offset so when backend converts to UTC, it becomes the original time
    const adjustedDate = new Date(localDate.getTime() - offsetMs);

    // Return as ISO string (backend will convert this to UTC, resulting in original input time)
    return adjustedDate.toISOString();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const eventStatus =
        formData.type === "Task" || formData.type === "Assignment Due"
          ? "pending"
          : "none";

      // ✅ Adjust for timezone offset so exact input time is stored in DB
      const eventDateObj = new Date(formData.date);
      const offsetMs = eventDateObj.getTimezoneOffset() * 60 * 1000;
      const adjustedEventDate = new Date(eventDateObj.getTime() - offsetMs);

      const startDateTime = buildLocalDateTime(
        formData.date,
        formData.startTime
      );
      const endDateTime = buildLocalDateTime(formData.date, formData.endTime);

      const response = await fetch("/api/addEvents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.name,
          description: formData.description,
          type: formData.type,
          eventDate: adjustedEventDate.toISOString(), // Adjusted date
          startTime: startDateTime, // Adjusted time
          endTime: endDateTime, // Adjusted time
          status: eventStatus,
          semesterId: selectedSemester?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create event");

      toast.success("Event added successfully!", {
        description: `${formData.name} (${formData.type}) has been added for ${formData.date}.`,
      });

      // ✅ Trigger parent refetch
      if (onEventAdded) onEventAdded();

      // Reset form
      setFormData({
        name: "",
        type: "",
        date: "",
        startTime: "",
        endTime: "",
        description: "",
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add event", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary shadow-elegant hover:shadow-hover transition-spring">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Create New Event
          </DialogTitle>
          <DialogDescription>
            Add a new event to your daily schedule.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              placeholder="E.g. Group project meeting"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Event Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details like location, notes, etc."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gradient-primary">
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
