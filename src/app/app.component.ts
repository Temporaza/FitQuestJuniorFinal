import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  displayMenu: boolean = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.displayMenu = this.shouldDisplayMenu();
      }
    });
  }

  shouldDisplayMenu(): boolean {
   // Add conditions based on the routes where you want to display the menu
   const allowedRoutes = ['/doctor-home', '/patient-data', '/doctor-consult'];
   return allowedRoutes.includes(this.router.url);
  }
}
