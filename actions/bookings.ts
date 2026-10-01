'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBooking(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const scheduledAt = new Date(formData.get('scheduledAt') as string);
  const durationHours = parseInt(formData.get('durationHours') as string) || 2;
  const specialNotes = formData.get('specialNotes') as string;

  // Upsert Client
  let client = await prisma.client.findUnique({ where: { email } });
  if (!client) {
    client = await prisma.client.create({
      data: { fullName, email, phone, address, emergencyContact: phone },
    });
  }

  // Get or create default service
  let service = await prisma.careService.findFirst();
  if (!service) {
    service = await prisma.careService.create({
      data: {
        title: "Standard Senior Care",
        slug: "standard-senior-care",
        description: "Comprehensive daily assistance and companion care.",
        hourlyRate: 30.0,
      },
    });
  }

  // Create Booking
  await prisma.booking.create({
    data: {
      clientId: client.id,
      serviceId: service.id,
      scheduledAt,
      durationHours,
      totalCost: service.hourlyRate * durationHours,
      specialNotes,
      status: 'PENDING',
    },
  });

  revalidatePath('/admin/dashboard');
  redirect('/admin/dashboard');
}
