import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IUpdateProfileData {
    name?: string;
    email?: string;
    image?: string;
}

export async function PATCH(
    request: Request
) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const { name, email, image }: IUpdateProfileData = body;

    try {
        const user = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                name,
                email,
                image,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
