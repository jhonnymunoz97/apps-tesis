import { Component, DoCheck, OnInit } from '@angular/core';
import {ViewChild, ElementRef} from '@angular/core';
import { Ruta } from 'src/app/models/ruta';
import { RutaService } from 'src/app/service/ruta.service';
import {Geolocation} from '@capacitor/geolocation';
import { Driver } from 'src/app/models/driver';
import { DriverService } from 'src/app/service/driver.service';
import { Assign } from 'src/app/models/assign';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})

export class RutasPage implements OnInit, DoCheck {

  driver: Driver;
  rutas: Ruta[];
  assigns: Assign[] = [];
  my_routes: any = []

  map:any;
  directionsServices = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
 
  @ViewChild('map',{read: ElementRef, static:false}) mapRef: ElementRef;

  constructor(private rutaService: RutaService,private driverService: DriverService,public http: HttpClient) {   }

  start_tour: boolean = false
  
  inicio:boolean = false
  fin: boolean = false


  ngDoCheck(): void {
    /* if(this.inicio) setTimeout(this.getLocation, 10000)
    if(this.fin) window.location.reload(); */
  }

  ngOnInit() {
    this.getAssigns()
    this.getRutas()
    this.getDriver()
    
  }

  ionViewDidEnter(){
    this.showMap()
    
  }

  ionViewDidLoad(){
    console.log("Hola") 
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
    });
  }

  getAssigns() {
    this.http
      .get<Assign[]>(environment.apiURL + 'assigns')
      .subscribe( data => {
        this.assigns = (data as any).data;
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        this.assigns = this.assigns.filter(data =>{
          if(data.driver.id == currentUser.id) return true
        })
        this.assigns.filter(data => {
          data.horarios.forEach(element => {
            if(!this.my_routes.includes(element.road)){
              this.my_routes.push(element.road)
            }
          });
        })
        let route_name = ''; let cont = 0
        this.my_routes = this.my_routes.filter(data=>{
          if(cont == 0) {route_name = data.name;cont++;return true}
          if(data.name != route_name){
            route_name = data.name
            return true
          }
        })
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
    let ruta =  this.my_routes[i]
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
status: boolean = false

onChange($event) {
  this.paintRoute(parseInt($event.target.value));
  this.status = true
}

setLocation(start: boolean){
  if(start) this.inicio = true
  else this.fin = true
  this.getLocation()
}

 getLocation = async () =>{
  while(!this.fin){
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
  window.location.reload()
}

}
