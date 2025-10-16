// ✅ Type definition for an event
export interface Event {
    id: string;
    name: string;
    type: string;
    startTime: Date;
    endTime: Date;
    description?: string;
    status?: "pending" | "done";
}

// ✅ Predefined event types
export const eventTypes = [
    "Meeting",
    "Workshop",
    "Conference",
    "Social",
    "Deadline",
    "Personal",
    "Other",
] as const;

// ✅ Sample events (mock data for local UI testing)
export const mockEvents: Event[] = [
    {
        id: "1",
        name: "Team Standup",
        type: "Meeting",
        startTime: new Date(2025, 9, 15, 9, 0),
        endTime: new Date(2025, 9, 15, 9, 30),
        description: "Daily team sync",
        status: "pending",
    },
    {
        id: "2",
        name: "Design Review",
        type: "Meeting",
        startTime: new Date(2025, 9, 15, 14, 0),
        endTime: new Date(2025, 9, 15, 15, 30),
        description: "Review new design mockups",
        status: "pending",
    },
    {
        id: "3",
        name: "Project Deadline",
        type: "Deadline",
        startTime: new Date(2025, 9, 15, 17, 0),
        endTime: new Date(2025, 9, 15, 17, 0),
        description: "Submit final deliverables",
        status: "pending",
    },
    {
        id: "4",
        name: "Coffee Chat",
        type: "Social",
        startTime: new Date(2025, 9, 16, 10, 30),
        endTime: new Date(2025, 9, 16, 11, 30),
        description: "Catch up with Sarah",
        status: "pending",
    },
    {
        id: "5",
        name: "UX Workshop",
        type: "Workshop",
        startTime: new Date(2025, 9, 17, 13, 0),
        endTime: new Date(2025, 9, 17, 16, 0),
        description: "User research techniques",
        status: "done",
    },
    {
        id: "6",
        name: "Client Presentation",
        type: "Meeting",
        startTime: new Date(2025, 9, 18, 11, 0),
        endTime: new Date(2025, 9, 18, 12, 0),
        description: "Present Q4 results",
        status: "pending",
    },
    {
        id: "7",
        name: "Yoga Class",
        type: "Personal",
        startTime: new Date(2025, 9, 18, 18, 0),
        endTime: new Date(2025, 9, 18, 19, 0),
        description: "Evening wellness session",
        status: "pending",
    },
    {
        id: "8",
        name: "Tech Conference",
        type: "Conference",
        startTime: new Date(2025, 9, 20, 9, 0),
        endTime: new Date(2025, 9, 20, 17, 0),
        description: "Annual tech summit",
        status: "done",
    },
    {
        id: "9",
        name: "Code Review",
        type: "Meeting",
        startTime: new Date(2025, 9, 21, 15, 0),
        endTime: new Date(2025, 9, 21, 16, 0),
        description: "Review sprint PRs",
        status: "pending",
    },
    {
        id: "10",
        name: "Dinner with Friends",
        type: "Social",
        startTime: new Date(2025, 9, 19, 19, 0),
        endTime: new Date(2025, 9, 19, 21, 0),
        description: "Italian restaurant downtown",
        status: "pending",
    },
];

// ✅ Utility function: returns color styling for event types
export const getEventTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        Meeting: "bg-primary/10 text-primary border-primary/20",
        Workshop: "bg-purple-100 text-purple-700 border-purple-200",
        Conference: "bg-blue-100 text-blue-700 border-blue-200",
        Social: "bg-pink-100 text-pink-700 border-pink-200",
        Deadline: "bg-red-100 text-red-700 border-red-200",
        Personal: "bg-green-100 text-green-700 border-green-200",
        Other: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[type] || colors.Other;
};
