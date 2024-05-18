import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthHomeParentGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.authState.pipe(
      map((user) => {
        // If user is logged in, allow navigation
        if (user) {
          return true;
        } else {
          // If user is not logged in, navigate to login page
          this.router.navigate(['/parent-login']);
          return false;
        }
      })
    );
  }
}
