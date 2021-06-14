import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
//import { from } from 'rxjs';

import {ViewChild, ElementRef} from '@angular/core';
import { Ruta } from 'src/app/models/ruta';
import { RutaService } from 'src/app/service/ruta.service';
import {Geolocation} from '@capacitor/geolocation';
import { Driver } from 'src/app/models/driver';
import { DriverService } from 'src/app/service/driver.service';
/* import {
  CameraPosition,
  GoogleMap,
  GoogleMapOptions,
  GoogleMaps,
  ILatLng,
  LatLng,
  LocationService,
  MyLocation,
} from "@ionic-native/google-maps";
import { LoadingController, ToastController, Platform } from "@ionic/angular"; */

/* import { Driver } from 'src/app/models/driver';
import { User } from 'src/app/models/user';
import { DriverService } from 'src/app/service/driver.service';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service'; */

declare var google: any;

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})

export class RutasPage implements OnInit, DoCheck {

  driver: Driver;
  rutas: Ruta[];

  map:any;
  directionsServices = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
 
  @ViewChild('map',{read: ElementRef, static:false}) mapRef: ElementRef;

  constructor(private rutaService: RutaService,private driverService: DriverService) {   }

  start_tour: boolean = false
  
  inicio:boolean = false
  fin: boolean = false


  ngDoCheck(): void {
    if(this.inicio) setTimeout(this.getLocation, 10000)
    if(this.fin) window.location.reload();
  }

  ngOnInit() {
    //window.location.reload()
    this.getRutas()
    this.getDriver()
  }

  ionViewDidEnter(){
    this.showMap()
  }

  showMap(){
    const location = new google.maps.LatLng(-1.05458, -80.45445);
    const options = {
      center: location,
      zoom: 15,
      disabledDefaultUI: true,
      
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.directionsDisplay.setMap(this.map)
  }

  getRutas() {
    this.rutaService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
      console.log(this.rutas)
    });
  }

  getDriver(){
    this.driverService.getDrivers().subscribe((drivers: Driver[]) => {
      let existe = false;
      let user = JSON.parse(localStorage.getItem('currentUser'))
      drivers.forEach((driver:Driver) =>{
        if(driver.email == user.email) {
          existe = true 
          this.driver = driver
        }
      });
      if (!existe) {
        this.driverService.addDriver(user);
        this.getDriver();
      }
    })
  }

  paintRoute(i:number){
    let ruta =  this.rutas[i]
    this.directionsServices.route(
      {
        origin: {
          lat: ruta.origin.lat,
          lng: ruta.origin.lng,
        },
        destination: {
          lat: ruta.destination.lat,
          lng: ruta.destination.lng,
        },
        waypoints: ruta.waypoints,
        travelMode: google.maps.TravelMode["DRIVING"],
      },
      (res, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsDisplay.setDirections(res)
        }else{
          alert('No se pudieron mostrar las direcciones debido a: ' + status)
        }
    })
   
}

onChange($event) {
  this.paintRoute(parseInt($event.target.value));
}

async setLocation(start: boolean){
  if(start) this.inicio = true
  else this.fin = true
}

 getLocation = async () =>{
  const coordenadas = await Geolocation.getCurrentPosition() 
  let location = {
      accuracy: coordenadas.coords.accuracy,
      altitude: coordenadas.coords.altitude,
      latLng:{
        lat: coordenadas.coords.latitude,
        lng: coordenadas.coords.longitude
      },
      speed: coordenadas.coords.speed,
  };
  this.driver.location = location
  this.driver.last_login = new Date();
  this.driverService.editDriver(this.driver);
}

}
