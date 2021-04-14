import { AvailabilitiesDB } from '@databases/availabilities';

const availabilitiesDB = new AvailabilitiesDB();

export async function createAppointment(
  clientId: string,
  availabilityId: string
): Promise<void> {
  await availabilitiesDB.createAppointment(availabilityId, clientId);
}
