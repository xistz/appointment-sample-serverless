import { Availability } from '@models/availability';
import { AvailabilitiesDB } from '@databases/availabilities';

const availabilitiesDB = new AvailabilitiesDB();

export async function getAvailabilities(
  fpId: string,
  from: string,
  to: string
): Promise<Availability[]> {
  // return [
  //   {
  //     id: 'random_id_1',
  //     fpId: 'random_fp_id',
  //     from: new Date(2021, 3, 7, 1).toISOString(),
  //   },
  //   {
  //     id: 'random_id_2',
  //     fpId: 'random_fp_id',
  //     from: new Date(2021, 3, 7, 1, 30).toISOString(),
  //   },
  // ];

  const availabilities = await availabilitiesDB.list(fpId, from, to);

  return availabilities;
}

export async function createAvailability(
  fpId: string,
  from: string
): Promise<Availability['id']> {
  const id = await availabilitiesDB.create(fpId, from);

  return id;
}

export async function deleteAvailability(
  id: string,
  fpId: string
): Promise<void> {
  await availabilitiesDB.delete(id, fpId);
}
