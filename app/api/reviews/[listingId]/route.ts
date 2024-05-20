import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const { listingId } = params;

    if (!listingId) {
        return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: {
                listingId: listingId,
            },
            include: {
                user: true,
            },
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Failed to fetch reviews", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}
