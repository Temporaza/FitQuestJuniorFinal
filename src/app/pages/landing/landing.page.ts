import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Replace '/login' with the actual route path
  }

  navigateToParentLogin() {
    this.router.navigate(['/parent-login']); // Replace '/parent-login' with the actual route path
  }
}
