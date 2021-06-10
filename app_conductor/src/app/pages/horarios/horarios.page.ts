import { HttpClient } from '@angular/common/http';
import { ArrayType } from '@angular/compiler';
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

  constructor(private assignsService: AsignacionesService, public http: HttpClient) { }

  day:number = 0

  assigns: Assign[] = [];
  asignacion_driver = []

  days: any = []

  showDays: boolean = null


  
  ngOnInit() {
    this.getAssigns()
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
      });
  }

  getHorarios(){
    this.asignacion_driver = []
    this.assigns.forEach(element => {
      let car = {
        id_vehiculo: element.vehicle_id,
        brand:element.vehicle.brand,
        model:element.vehicle.model,
        year:element.vehicle.year,
        nro_reg:element.vehicle.registration_no,
        horario: [] 
      }
      element.horarios.forEach(e => {
          car.horario.push(
            {
              day: e.day,
              start_hour: e.start_hour,
              end_hour: e.end_hour,
              route_name: e.road.name
            }
          ) 
      });
      this.asignacion_driver.push(car)
    });
    console.log(this.asignacion_driver)
  }


  setDia(dia:number){
    if(this.day==0)this.day = dia
    let day_ant = document.getElementById(`day${this.day}`)
    day_ant.classList.remove("border")
    let day = document.getElementById(`day${dia}`)
    day.classList.add("border")
    this.day = dia
    this.getHorarios()
    this.getHorarioDay(dia)
    this.showHorario()
  }

  showHorario(){

  }

  getHorarioDay(dia:number){
    let day = this.getDay(dia) 
    this.days = []
    this.asignacion_driver.forEach(element => {      
      let car = {
        id_vehiculo: element.id_vehiculo,
        model: element.model,
        nro_reg: element.nro_reg,
        year: element.year,
        brand: element.brand,
        dia: []
      }
      element.horario.forEach(e => {
        if(e.day === day){
          car.dia.push(
            {
              day: e.day,
              start_hour: e.start_hour,
              end_hour: e.end_hour,
              route_name: e.route_name
            }
          )
        }
      });
      if(car.dia.length > 0) this.days.push(car)
    });
    if(this.days.length>0) this.showDays = true
    else this.showDays = false
  }

  getDay(dia:number):string{
    if(dia == 1) return "Lunes"
    if(dia == 2) return "Martes"
    if(dia == 3) return "Miércoles"
    if(dia == 4) return "Jueves"
    if(dia == 5) return "Viernes"
    if(dia == 6) return "Sábado"
    if(dia == 7) return "Domingo"
  }
  color: number
  colors(max:number,min: number){
    this.color = Math.floor((Math.random() * (max - min + 1)) + min)
    console.log(this.color)
  }
}
