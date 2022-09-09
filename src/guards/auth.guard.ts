import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router, private toast: HotToastService) { }

  canActivate() {

    if (this.authService.currentUser) {

      return true;

    } else {

      this.router.navigate(['/login']);
      this.toast.error('Please log in with username and password credentials or as a guest.');
      return false;

    }
    
  }
  
}
