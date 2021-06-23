import { HttpClient } from '@angular/common/http';
import { ArrayType, ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Assign, DayHorario } from 'src/app/models/assign';
import { AsignacionesService } from 'src/app/service/asignaciones.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {
  day = 0;

  assigns: Assign[] = [];
  asignacionDriver = [];

  days: any = [];

  showDays: boolean = null;
  constructor(
    private assignsService: AsignacionesService,
    public http: HttpClient
  ) {}

  ngOnInit() {
    this.getAssigns();
    this.setDia(1);
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
        console.log(this.assigns);
      });
  }

  getHorarios() {
    this.asignacionDriver = [];
    this.assigns.forEach((element) => {
      const car = {
        idVehiculo: element.vehicle_id,
        brand: element.vehicle.brand,
        model: element.vehicle.model,
        year: element.vehicle.year,
        nroReg: element.vehicle.registration_no,
        horario: [],
      };
      element.horarios.forEach((e) => {
        car.horario.push({
          day: e.day,
          startHour: e.start_hour,
          endHour: e.end_hour,
          route: e.road.name,
        });
      });
      this.asignacionDriver.push(car);
    });
    console.log(this.asignacionDriver);
  }

  setDia(dia: number) {
    if (this.day === 0) {
      this.day = dia;
    }
    const dayAnt = document.getElementById(`day${this.day}`);
    dayAnt.classList.remove('border');
    const day = document.getElementById(`day${dia}`);
    day.classList.add('border');
    this.day = dia;
    this.getHorarios();
    this.getHorarioDay(dia);
  }

  getHorarioDay(dia: number) {
    const day = this.getDay(dia);
    this.days = [];
    this.asignacionDriver.forEach((element) => {
      const car = {
        idVehiculo: element.idVehiculo,
        model: element.model,
        nroReg: element.nroReg,
        year: element.year,
        brand: element.brand,
        dia: [],
      };
      element.horario.forEach((e) => {
        if (e.day === day) {
          car.dia.push({
            day: e.day,
            startHour: e.startHour,
            endHour: e.endHour,
            route: e.route,
          });
        }
      });
      if (car.dia.length > 0) {
        this.days.push(car);
      }
    });
    if (this.days.length > 0) {
      this.showDays = true;
    } else {
      this.showDays = false;
    }

    console.log(this.days);
  }

  getDay(dia: number): string {
    if (dia === 1) {
      return 'Lunes';
    }
    if (dia === 2) {
      return 'Martes';
    }
    if (dia === 3) {
      return 'Miércoles';
    }
    if (dia === 4) {
      return 'Jueves';
    }
    if (dia === 5) {
      return 'Viernes';
    }
    if (dia === 6) {
      return 'Sábado';
    }
    if (dia === 7) {
      return 'Domingo';
    }
  }
}
