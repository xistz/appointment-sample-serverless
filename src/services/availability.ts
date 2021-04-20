import { Availability, AvailabilityTime } from '@models/availability';
import { AvailabilitiesDB } from '@databases/availabilities';

const availabilitiesDB = new AvailabilitiesDB();

export async function getAvailabilities(
  fpId: string,
  from: string,
  to: string
): Promise<Availability[]> {
  const parsedFrom = new Date(from).toISOString();
  const parsedTo = new Date(to).toISOString();

  const availabilities = await availabilitiesDB.listAvailabilities(
    fpId,
    parsedFrom,
    parsedTo
  );

  return availabilities;
}

export async function createAvailability(
  fpId: string,
  from: string
): Promise<Availability['id']> {
  const parsedFrom = new Date(from).toISOString();

  const id = await availabilitiesDB.createAvailability(fpId, parsedFrom);

  return id;
}

export async function deleteAvailability(
  id: string,
  fpId: string
): Promise<void> {
  await availabilitiesDB.deleteAvailability(id, fpId);
}

export async function searchAvailabilitiesByDate(
  from: string,
  to: string,
  clientId: string
): Promise<AvailabilityTime[]> {
  const parsedFrom = new Date(from).toISOString();
  const parsedTo = new Date(to).toISOString();

  // get times
  const availabilities = await availabilitiesDB.listAvailabilitiesByDate(
    parsedFrom,
    parsedTo
  );

  // get client appointments
  const appointments = await availabilitiesDB.listClientAppointments(
    clientId,
    parsedFrom,
    parsedTo
  );
  const appointmentTimes = appointments.map((appointment) => appointment.from);

  // exclude client appointment times
  const availableTimes = availabilities.filter(
    (availability) => !appointmentTimes.includes(availability.from)
  );

  return availableTimes;
}

export async function searchAvailabilitiesByTime(
  at: string
): Promise<Availability[]> {
  return [];
}
