import { Driver } from './driver';
import { Marker } from './marker';

export class Ruta {
  $key?: any;
  origin: Location;
  name: string;
  destination: Location;
  waypoints?: Location[];
  driver?: Driver;
  markers?: Marker[];
}
export class Location {
  lat: number;
  lng: number;
  location?: any;
}
export class WayPoint {
  location: { location: Location };
}
