import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading = false;
  submitted = false;
  returnUrl: string;
  error = "";
  loginForm: FormGroup;
  userStatus = true


  constructor(
    public formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {  }

  ngOnInit() {
    let sesion = localStorage.getItem('currentUser')
    if(sesion != null) this.router.navigate(['home'])
    this.loginForm = this.formBuilder.group({
      dni: ["",[Validators.required,Validators.minLength(10),Validators.maxLength(10),] ],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });    
  }

  showConsole(){
    console.log(this.loginService.user)
  }

  login(event:Event) {
    event.preventDefault();
    if (!this.loginForm.valid) {
    } else {
      this.loginService.login(this.loginForm.value.dni,this.loginForm.value.password)
    }
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  
}
