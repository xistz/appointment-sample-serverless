import { Availability } from './availability';
import { User } from './user';

export interface Appointment extends Availability {
  clientId: string;
}

export interface AppointmentDetails extends Omit<Availability, 'fpId'> {
  fp: User;
  client: User;
}
