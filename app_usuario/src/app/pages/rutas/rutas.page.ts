import { Component, OnInit } from '@angular/core';
import {ViewChild, ElementRef} from '@angular/core';
import { Ruta } from 'src/app/models/ruta';
import { RutaService } from 'src/app/service/ruta.service';
import { DriverService } from 'src/app/service/driver.service';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})

export class RutasPage implements OnInit{

  rutas: Ruta[];

  indexRoute:number = 0
  status: boolean = false

  map:any;
  directionsServices = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
 
  @ViewChild('map',{read: ElementRef, static:false}) mapRef: ElementRef;

  constructor(private rutaService: RutaService,private driverService: DriverService,public http: HttpClient) {   }


  ngOnInit() {
    this.getRutas()    
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

  paintRoute(i:number){
    this.status = true
    if(i==1){
      this.indexRoute = this.indexRoute + 1
      if( this.indexRoute  == this.rutas.length) this.indexRoute = 0
    }
    else if(i==0){
      this.indexRoute = this.indexRoute - 1 
      if(this.indexRoute < 0) this.indexRoute = this.rutas.length -1
    }
    let ruta =  this.rutas[this.indexRoute]
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

}
