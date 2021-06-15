export interface Drivers {
    $key?: string; // Angular necesita este campo.
    dni: string;
    name: string;
    surname: string;
    email: string;
    telefono: string;
    licencia: string;
    last_login: Date;
    location?: any;
  }