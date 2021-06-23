/* eslint-disable @typescript-eslint/naming-convention */
import { Component, DoCheck, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Ruta } from 'src/app/models/ruta';
import { RutaService } from 'src/app/service/ruta.service';
import { Geolocation } from '@capacitor/geolocation';
import { Driver } from 'src/app/models/driver';
import { DriverService } from 'src/app/service/driver.service';
import { Assign } from 'src/app/models/assign';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
//declare let google: any;
@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})
export class RutasPage implements OnInit, DoCheck {
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  marker: google.maps.Marker = null;
  driver: Driver;
  rutas: Ruta[];
  assigns: Assign[] = [];
  myRoutes: any = [];
  startTour = false;
  status = false;

  inicio = false;
  fin = false;
  map: google.maps.Map;
  directionsServices = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  constructor(
    private rutaService: RutaService,
    private driverService: DriverService,
    public http: HttpClient
  ) {}

  ngDoCheck(): void {
    /* if(this.inicio) setTimeout(this.getLocation, 10000)
    if(this.fin) window.location.reload(); */
  }

  async ngOnInit() {
    this.getAssigns();
    this.getRutas();
    this.getDriver();
    const coordinates = await Geolocation.getCurrentPosition();
    this.showMap(coordinates.coords.latitude, coordinates.coords.longitude);
    this.marker = new google.maps.Marker({
      position: {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      },
      map: this.map,
      icon: {
        url: 'assets/icon/marker.png',
      },
      visible: true,
    });
  }

  async ionViewDidEnter() {}

  ionViewDidLoad() {}

  showMap(lat, lng) {
    const location = new google.maps.LatLng(lat, lng);
    const options = {
      center: location,
      zoom: 17,
      disabledDefaultUI: true,
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.directionsDisplay.setMap(this.map);
  }

  getRutas() {
    this.rutaService.getRutas().subscribe((rutas: Ruta[]) => {
      this.rutas = rutas;
    });
  }

  getAssigns() {
    this.http
      .get<Assign[]>(environment.apiURL + 'assigns')
      .subscribe((data) => {
        this.assigns = (data as any).data;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.assigns = this.assigns.filter((data2) => {
          if (data2.driver.id === currentUser.id) {
            return true;
          }
        });
        this.assigns.filter((data3) => {
          data3.horarios.forEach((element) => {
            if (!this.myRoutes.includes(element.road)) {
              this.myRoutes.push(element.road);
            }
          });
        });
        let routeName = '';
        let cont = 0;
        this.myRoutes = this.myRoutes.filter((data5: { name: string }) => {
          if (cont === 0) {
            routeName = data5.name;
            cont++;
            return true;
          }
          if (data5.name !== routeName) {
            routeName = data5.name;
            return true;
          }
        });
      });
  }

  getDriver() {
    this.driverService.getDrivers().subscribe((drivers: Driver[]) => {
      let existe = false;
      const user = JSON.parse(localStorage.getItem('currentUser'));
      drivers.forEach((driver: Driver) => {
        if (driver.email === user.email) {
          existe = true;
          this.driver = driver;
        }
      });
      if (!existe) {
        this.driverService.addDriver(user);
        this.getDriver();
      }
    });
  }

  paintRoute(i: number) {
    const ruta = this.myRoutes[i];
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
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (res, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsDisplay.setDirections(res);
        } else {
          alert('No se pudieron mostrar las direcciones debido a: ' + status);
        }
      }
    );
  }

  onChange($event) {
    this.paintRoute(parseInt($event.target.value, 10));
    this.status = true;
  }

  setLocation(start: boolean) {
    if (start) {
      this.inicio = true;
    } else {
      this.fin = true;
    }
    this.getLocation();
  }

  getLocation = async () => {
    Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
      },
      (coordenadas) => {
        const location = {
          accuracy: coordenadas.coords.accuracy,
          altitude: coordenadas.coords.altitude,
          latLng: {
            lat: coordenadas.coords.latitude,
            lng: coordenadas.coords.longitude,
          },
          speed: coordenadas.coords.speed,
        };
        this.map.setCenter(location.latLng);
        this.map.setZoom(18);
        this.marker.setVisible(true);
        this.marker.setPosition(location.latLng);
        this.driver.location = location;
        this.driver.last_login = new Date();
        this.driverService.editDriver(this.driver);
        /* this.driverService.addRecord({
          driver: this.driver,
          location,
        }); */
        if (this.fin) {
          window.location.reload();
        }
      }
    );
  };
}
