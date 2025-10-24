import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        // 🧠 1. Extract week number from URL query
        const { searchParams } = new URL(req.url);
        const currentWeek = Number(searchParams.get("currentWeek"));

        if (!currentWeek) {
            return NextResponse.json({ error: "Missing currentWeek" }, { status: 400 });
        }

        // 🧠 2. Fetch the current weeksActive array
        const courseEvent = await prisma.courseEvent.findUnique({
            where: { id: params.id },
            select: { weeksActive: true },
        });

        if (!courseEvent) {
            return NextResponse.json({ error: "Course event not found" }, { status: 404 });
        }

        // 🧠 3. Remove the currentWeek value from the array
        const updatedWeeks = courseEvent.weeksActive.filter((w) => w !== currentWeek);

        // 🧠 4. Update in database
        const updated = await prisma.courseEvent.update({
            where: { id: params.id },
            data: { weeksActive: updatedWeeks },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating weeksActive:", error);
        return NextResponse.json({ error: "Failed to update weeksActive" }, { status: 500 });
    }
}