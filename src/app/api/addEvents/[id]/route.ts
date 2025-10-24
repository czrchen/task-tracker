import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    context: { params: { id: string } } // ✅ correct typing
) {
    try {
        const { id } = context.params; // ✅ Extract id properly
        const data = await req.json();

        const updatedEvent = await prisma.event.update({
            where: { id },
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
        return NextResponse.json(
            { error: "Failed to update event" },
            { status: 500 }
        );
    }
}
