export interface Availability extends AvailabilityTime, AvailabilityFP {}

export interface AvailabilityTime {
  from: string;
}

export interface AvailabilityFP extends AvailabilityId {
  fpId: string;
}

export interface AvailabilityDetail extends AvailabilityId {
  fpName: string;
  fpPicture: string;
}

interface AvailabilityId {
  id: string;
}
