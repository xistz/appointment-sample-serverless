import { User } from './user';

export interface Availability extends AvailabilityTime, AvailabilityFP {}

export interface AvailabilityTime {
  from: string;
}

export interface AvailabilityFP extends AvailabilityId {
  fpId: string;
}

export interface AvailabilityDetail extends AvailabilityId {
  fp: User;
}

interface AvailabilityId {
  id: string;
}
