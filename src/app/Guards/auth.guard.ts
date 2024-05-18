import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated().then((authenticated) => {
      if (authenticated) {
        return true; // User is authenticated, allow navigation to the home page
      } else {
        this.router.navigate(['/login']); // User is not authenticated, redirect to login page
        return false;
      }
    });
  }
}
