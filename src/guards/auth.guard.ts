import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private toast: HotToastService) { }

  public canActivate(): Observable<boolean> {

    return new Observable((subscriber) => {

      const isAlreadyLoggedIn = localStorage.getItem('currentUserPlusTokenAsText');

      if (isAlreadyLoggedIn) {

        subscriber.next(true);

      } else {

        this.router.navigate(['/login']);
        this.toast.error('Please log in with username and password credentials or as a guest.');
        subscriber.next(false);

      }

      subscriber.complete();

    });
    
  }

}
