export interface ILocations {
  id: number; // I may make unique id later
  name: string;
  day: number;
  tourId: number;
  coordinates: Array<number>;
}
