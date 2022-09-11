import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUser!: User;

  constructor(private router: Router) { }

  saveCurrentUser() {

    const currentUserAsText = JSON.stringify(this.currentUser);
    localStorage.setItem('currentUserAsText', currentUserAsText);

  }

  getCurrentUser() {

    const currentUserAsText = localStorage.getItem('currentUserAsText');

    if (currentUserAsText) {

      this.currentUser = JSON.parse(currentUserAsText);
      
    }

    return this.currentUser;

  }

  deleteCurrentUser() {

    localStorage.removeItem('currentUserAsText');
    this.router.navigate(['/login']);

  }

}
