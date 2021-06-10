import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assign } from '../models/assign';
import { map } from 'rxjs/operators';

import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Driver } from '../models/driver';
import { Vehicles } from '../models/vehicles';

@Injectable({
  providedIn: 'root'
})
export class AsignacionesService {

  private assignsDB: AngularFireList<Assign>;
  assigns: Assign[] = [];
  user: User | Driver;
  vehicles: Vehicles


  constructor(public http: HttpClient,private db: AngularFireDatabase) { 
    this.assignsDB = this.db.list('/assigns');
  }

  /* getUser(id: number) {
    this.http
      .get<User[]>(environment.apiURL + 'users/' + id)
      .subscribe((data) => {
        this.user = (data as any).data;
        this.user.profilePhoto = this.user.profilePhoto
          ? this.user.profilePhoto
          : 'https://i.pravatar.cc/1000';

        console.log(this.user) 
      });
  } */

  getVehicles() {
    this.http
      .get<Vehicles[]>(environment.apiURL + 'vehicles')
      .subscribe((data) => {
        this.vehicles  = <Vehicles>(data as any).data;
        console.log(this.vehicles)
      });
  }

  getAssigns():any {
    let response = this.http
      .get<Assign[]>(environment.apiURL + 'assigns')
      .subscribe( data => {
        this.assigns = (data as any).data;
        /* let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        this.assigns = this.assigns.filter(data =>{
          if(data.driver.id == 3) return true
        }) */
        //console.log(this.assigns)
        return (data as any).data;
      });
    return response
  }




}
