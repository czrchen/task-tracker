import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // ✅ Next.js 15: params is a Promise
) {
    try {
        const { id } = await params; // ✅ Await the params
        const data = await req.json();

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                eventDate: new Date(data.eventDate),
                startTime: data.startTime ? new Date(data.startTime) : null,
                endTime: data.endTime ? new Date(data.endTime) : null,
                status: data.status,
            },
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json(
            { error: "Failed to update event" },
            { status: 500 }
        );
    }
}