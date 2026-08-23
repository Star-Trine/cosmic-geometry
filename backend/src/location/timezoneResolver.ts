export interface TimezoneResolver {
  resolve(latitude: number, longitude: number): string;
}
