import { AvailabilitiesDB } from '@databases/availabilities';
import { AppointmentDetails } from '@models/appointment';
import { getUsers } from './user';

const availabilitiesDB = new AvailabilitiesDB();

export async function createAppointment(
  clientId: string,
  availabilityId: string
): Promise<void> {
  await availabilitiesDB.createAppointment(availabilityId, clientId);
}

export async function deleteAppointment(
  availabilityId: string,
  userId: string
): Promise<void> {
  await availabilitiesDB.deleteAppointment(availabilityId, userId);
}

export async function listAppointments(
  userId: string,
  isFP: boolean = false,
  from: string,
  to: string
): Promise<AppointmentDetails[]> {
  const parsedFrom = new Date(from).toISOString();
  const parsedTo = new Date(to).toISOString();

  const appointments = isFP
    ? await availabilitiesDB.listFpAppointments(userId, parsedFrom, parsedTo)
    : await availabilitiesDB.listClientAppointments(
        userId,
        parsedFrom,
        parsedTo
      );

  if (appointments.length === 0) {
    return [];
  }

  const userIds = new Set<string>();
  appointments.forEach((appointment) =>
    userIds.add(appointment.clientId).add(appointment.fpId)
  );

  const users = await getUsers(Array.from(userIds));

  const appointmentDetails = appointments.map((appointment) => {
    const { id, from } = appointment;
    const fp = users[appointment.fpId];
    const client = users[appointment.clientId];

    return {
      id,
      from,
      fp,
      client,
    };
  });

  return appointmentDetails;
}
