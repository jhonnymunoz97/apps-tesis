import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
//import { from } from 'rxjs';

import {ViewChild, ElementRef} from '@angular/core';
import { Ruta } from 'src/app/models/ruta';
import { RutaService } from 'src/app/service/ruta.service';
import {Geolocation} from '@capacitor/geolocation';
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


  rutas: Ruta[];

  map:any;
  directionsServices = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  //@Input() title:string;
 
  @ViewChild('map',{read: ElementRef, static:false}) mapRef: ElementRef;

  constructor(private rutaService: RutaService) {
    this.option_tour = false
   }

  start_tour: boolean = false
  
  inicio:boolean = false
  fin: boolean = false

  ngDoCheck(): void {
    //throw new Error('Method not implemented.');
    /* if(this.start_tour){
      setTimeout(this.getLocation, 5000)
    }else{
      if(this.fin) console.log('Fin del recorrido')
      //console.log("Fin de geolocalización")
      //window.location.reload();
    } */
    
    //console.log('doCheak')

    if(this.inicio) setTimeout(this.getLocation, 5000)
    if(this.fin) window.location.reload();
  }
  
  /* ngOnChanges(changes: SimpleChanges): void {
    //throw new Error('Method not implemented.');
    console.log(changes)
  } */

  ngOnInit() {
    this.getRutas()
    //this.title = 'Hola'
  }

  alerta(){
    console.log("Hola")
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
          alert('Could not display directions due to:' + status)
        }
    })
   
}

onChange($event) {
  this.paintRoute(parseInt($event.target.value));
}


//start_tour: boolean = false
setLocation(start: boolean){
  /* this.start_tour = start 
  if(!this.start_tour) this.fin = true */
  if(start) this.inicio = true
  else this.fin = true
}

option_tour:boolean

async getLocation(){
  const coordenadas = await Geolocation.getCurrentPosition() 
  let latitude = coordenadas.coords.latitude
  let longitude = coordenadas.coords.longitude
  console.log("La latitud es: " + latitude)
  console.log("La longitud es: " + longitude)
  //}else{
  /* if(this.start_tour){
    const coordenadas = await Geolocation.getCurrentPosition() 
    let latitude = coordenadas.coords.latitude
    let longitude = coordenadas.coords.longitude
    console.log("La latitud es: " + latitude)
    console.log("La longitud es: " + longitude)
  }else{
    
  } */
  ///this.title = 'jajajja'
}

}
