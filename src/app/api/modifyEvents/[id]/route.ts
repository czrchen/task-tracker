import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ PATCH – mark as completed
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params; // 👈 await params

    try {
        const { status } = await request.json();

        const updated = await prisma.event.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error("Error marking complete:", err);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

// ✅ DELETE – remove event
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params; // 👈 await params

    try {
        await prisma.event.delete({ where: { id } });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Error deleting event:", err);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
