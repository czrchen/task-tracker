import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const semesters = await prisma.semester.findMany({
            orderBy: { startDate: "asc" },
        });
        return NextResponse.json(semesters);
    } catch (error) {
        console.error("Error fetching semesters:", error);
        return NextResponse.json({ error: "Failed to fetch semesters" }, { status: 500 });
    }
}
