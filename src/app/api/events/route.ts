import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const semesterId = searchParams.get("semesterId");

    try {
        const events = await prisma.courseEvent.findMany({
            where: semesterId ? { semesterId } : undefined,
            orderBy: { startTime: "asc" },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}
