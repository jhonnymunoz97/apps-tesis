import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: any;

  constructor(private router: Router) {
    //window.location.reload()
  }

  ngOnInit() {
    //window.location.reload()
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user.profilePhoto == null) {
      this.user.profilePhoto = 'https://i.pravatar.cc/1000';
    }
  }

  getUrl(): string {
    return this.router.url;
  }
}
