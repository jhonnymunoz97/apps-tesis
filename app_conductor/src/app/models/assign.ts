import { Driver } from './driver';
import { Ruta } from './ruta';
import { Vehicles } from './vehicles';

export class Horario {
  road: Ruta = null;
  day: string = null;
  start_hour: string;
  end_hour: string;
}

export class Assign {
  id?: number;
  driver_id: number = null;
  vehicle_id: number = null;
  driver?: Driver;
  horarios: Horario[] = [];
  start_date: Date;
  end_date?: Date;
  vehicle?: Vehicles;
}

export class Dia{
  day: string;
  end_hour:string;
  start_hour:string;
  route_name:string;
}

export class DayHorario{
  brand:string;
  dia: Dia[] = [];
  id_vehiculo: string;
  model: string;
  nro_reg:string;
  year:string;
}