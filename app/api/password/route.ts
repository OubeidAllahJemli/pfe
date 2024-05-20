import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
}

export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const body: PasswordFormValues = await request.json();
  const { currentPassword, newPassword } = body;

  if (!currentUser.hashedPassword) {
    throw new Error('Current password is not set');
  }

  const passwordMatches = await bcrypt.compare(currentPassword, currentUser.hashedPassword);
  if (!passwordMatches) {
    throw new Error('Current password is incorrect');
  }


  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { hashedPassword: hashedNewPassword },
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    throw new Error('Failed to update password');
  }
}
