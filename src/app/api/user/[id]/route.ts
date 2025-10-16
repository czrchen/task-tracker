import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> } // 👈 params is a Promise
) {
    try {
        const { id } = await context.params; // 👈 await it first

        if (!id) {
            return NextResponse.json({ error: "User ID missing" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: { semester: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}