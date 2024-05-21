import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
    listingId?: string;
}

interface IUpdateListingData {
    title?: string;
    description?: string;
    price?: number;
    imageSrc?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }
    const { listingId } = params;
    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid ID');
    }

    const listing = await prisma.listing.deleteMany({
        where: {
            id: listingId,
            userId: currentUser.id
        }
    });

    return NextResponse.json(listing);
}

export async function PATCH(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;
    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid ID');
    }

    const body = await request.json();
    const { title, description, price, imageSrc }: IUpdateListingData = body;

    
    try {
        const listing = await prisma.listing.updateMany({
            where: {
                id: listingId,
                userId: currentUser.id
            },
            data: {
                title,
                description,
                price,
                imageSrc,
            }
        });

        return NextResponse.json(listing);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
    }
}