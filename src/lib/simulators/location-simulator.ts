export interface Coordinate {
  lat: number;
  lng: number;
}

export interface ILocationService {
  startTracking(
    origin: Coordinate,
    destination: Coordinate,
    onUpdate: (position: Coordinate, heading: number) => void
  ): void;
  stopTracking(): void;
}

export class LocationSimulator implements ILocationService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private progress = 0;

  startTracking(
    origin: Coordinate,
    destination: Coordinate,
    onUpdate: (position: Coordinate, heading: number) => void
  ): void {
    this.progress = 0;
    this.stopTracking();

    this.intervalId = setInterval(() => {
      this.progress += 0.02 + Math.random() * 0.02; // ~2-4% per tick

      if (this.progress >= 1) {
        this.progress = 1;
        this.stopTracking();
      }

      const lat = origin.lat + (destination.lat - origin.lat) * this.progress;
      const lng = origin.lng + (destination.lng - origin.lng) * this.progress;

      // Add slight randomness for realism
      const jitter = 0.0005;
      const position: Coordinate = {
        lat: lat + (Math.random() - 0.5) * jitter,
        lng: lng + (Math.random() - 0.5) * jitter,
      };

      const heading =
        (Math.atan2(
          destination.lng - origin.lng,
          destination.lat - origin.lat
        ) *
          180) /
        Math.PI;

      onUpdate(position, heading);
    }, 4000); // Update every 4s
  }

  stopTracking(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const locationService: ILocationService = new LocationSimulator();
