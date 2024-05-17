import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

{/*2:08:01 / 8:40:33*/}

export async function POST(
    request: Request
) {
    const body = await request.json();
    const {
        email,
        name,
        password
    } =body;
 
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword
        }
    });

    return NextResponse.json(user);
}
