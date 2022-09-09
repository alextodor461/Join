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

    let currentUserAsText = JSON.stringify(this.currentUser);
    localStorage.setItem('currentUserAsText', currentUserAsText);

  }

  getCurrentUser() {

    let currentUserAsText = localStorage.getItem('currentUserAsText');

    if (currentUserAsText) {

      this.currentUser = JSON.parse(currentUserAsText);
      
    }

  }

  deleteCurrentUser() {

    localStorage.removeItem('currentUserAsText');
    this.router.navigate(['/login']);

  }

}