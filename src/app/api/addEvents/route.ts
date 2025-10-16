// app/api/addEvents/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🟢 CREATE event (POST)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            title,
            description,
            type,
            eventDate,
            startTime,
            endTime,
            status,
            semesterId,
        } = body;

        // ✅ Parse incoming ISO strings directly
        const eventDateObj = new Date(eventDate);
        const startDateTime = startTime ? new Date(startTime) : null;
        const endDateTime = endTime ? new Date(endTime) : null;

        const newEvent = await prisma.event.create({
            data: {
                title,
                description,
                type,
                eventDate: eventDateObj,
                startTime: startDateTime,
                endTime: endDateTime,
                status,
                semesterId: semesterId || null,
            },
        });

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Failed to create event" },
            { status: 500 }
        );
    }
}

// 🟣 READ events (GET)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const semesterId = searchParams.get("semesterId");

        const filters: any = {};
        if (semesterId) {
            filters.semesterId = semesterId;
        }

        const events = await prisma.event.findMany({
            where: filters,
            orderBy: [
                { eventDate: "asc" },
                { startTime: "asc" },
            ],
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}
