import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const data = await req.json();
        const updatedEvent = await prisma.event.update({
            where: { id: params.id },
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                eventDate: new Date(data.eventDate),
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
                status: data.status,
            },
        });
        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}
