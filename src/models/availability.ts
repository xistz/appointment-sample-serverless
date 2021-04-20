export interface Availability extends AvailabilityTime, AvailabilityFP {}

export interface AvailabilityTime {
  from: string;
}

export interface AvailabilityFP {
  id: string;
  fpId: string;
}
