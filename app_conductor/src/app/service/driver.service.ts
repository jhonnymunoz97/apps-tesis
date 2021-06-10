import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Injectable } from "@angular/core";
import { Driver } from "../models/driver";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DriverService {
  // Este contendra una Coleccion de Driveres de la DB.
  private driversDB: AngularFireList<Driver>;

  constructor(private db: AngularFireDatabase) {
    // ? Accedemos a la base de datos de firebase.
    // ? Vamos a acceder la lista de drivers en la db.
    // ? y se implementa la funcionalidad en el segundo argumento.
    // ? La referencia que es nuestra lista de drivers, se va a ordenar por name.
    this.driversDB = this.db.list("/drivers", (ref) => ref.orderByChild("last_login"));
  }

  // Devuelve un Observable de tipo Driver Array.
  getDrivers(): Observable<Driver[]> {
    // ? this.driversDB ya tiene la base de datos.
    // ? snapshotChanges obtiene la informacion en este momento.
    // ? Obtiene los datos junto con la Key
    // ? Con Pipe permite hacer modificaciones
    // ? Con Map haremos un cambio, que por cada uno de los drivers retornaremos la informacion,
    // ? y se Agregue una Key.
    // ? El formato de key siempre es $key.
    // ? Payload es por donde esta viajando la data.
    return this.driversDB.snapshotChanges().pipe(
      // ?A veces hay que importar map manualmente de rsjs/operators
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }

  // Metodo para crear un nuevo driver en la DB
  addDriver(driver: any) {
    // ?Con esto FireBase se encarga de todo,
    // ?no hay que pensar en endpoints o si esta o no creada la tabla.
    // ?Adicionamos un nuevo record a la tabla.
    return this.driversDB.push(driver);
  }

  // Borrar un Driver de la DB
  deleteDriver(id: string) {
    // ? Que base de datos afectaremos? Driveres.
    // ? El id del driver que deseamos eliminar.
    this.db.list("/drivers").remove(id);
  }

  // Editar un Driver
  editDriver(newDriverData) {
    // ? Salvamos el Key.
    // ? Eliminamos el registro anterior con el Key.
    // ? Nuevamente asignamos a ese registro la nueva información en la base de datos.
    // ? FireBase no acepta que ya se contenga una Key, por eso se hizo la Key opcional.
    // ? Al borrar o actualizar daria problema sino fuera opcional.
    const $key = newDriverData.$key;
    delete newDriverData.$key;
    this.db.list("/drivers").update($key, newDriverData);
  }
}
