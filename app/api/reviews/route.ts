import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const { rating, comment, listingId } = body;

    try {
        const review = await prisma.review.create({
            data: {
                rating: parseInt(rating, 10),
                comment,
                listingId: listingId,
                userId: currentUser.id,
            },
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error("Failed to submit review", error);
        return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }
}
