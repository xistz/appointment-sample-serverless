import { Availability } from '@models/availability';
import { AvailabilitiesDB } from '@databases/availabilities';

const availabilitiesDB = new AvailabilitiesDB();

export async function getAvailabilities(
  fpId: string,
  from: string,
  to: string
): Promise<Availability[]> {
  const parsedFrom = new Date(from).toISOString();
  const parsedTo = new Date(to).toISOString();

  const availabilities = await availabilitiesDB.list(
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

  const id = await availabilitiesDB.create(fpId, parsedFrom);

  return id;
}

export async function deleteAvailability(
  id: string,
  fpId: string
): Promise<void> {
  await availabilitiesDB.delete(id, fpId);
}

export async function searchAvailabilitiesByDate(
  from: string,
  to: string,
  clientId: string
): Promise<Availability[]> {
  const parsedFrom = new Date(from).toISOString();
  const parsedTo = new Date(to).toISOString();

  return await availabilitiesDB.listAvailableByDate(parsedFrom, parsedTo);
}

export async function searchAvailabilitiesByTime(
  at: string
): Promise<Availability[]> {
  return [];
}
