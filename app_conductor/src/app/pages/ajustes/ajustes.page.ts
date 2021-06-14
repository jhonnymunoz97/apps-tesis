import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  user: any
  constructor(public loginService: LoginService) { }

  ngOnInit() {
    //window.location.reload()
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    if (this.user.profilePhoto == null) this.user.profilePhoto = 'https://i.pravatar.cc/1000'
  }

}
