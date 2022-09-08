import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Join';

  constructor(private router: Router, private auth: AuthenticationService, private toast: HotToastService) { }

  ngOnInit(): void { }

  checkNotLoginOrSignup() {

    const currentPath = this.router.url;

    if (currentPath === '/login' || currentPath === '/signup') {

      return false;

    } else {

      return true;
      
    }

  }

  logout() {

    this.auth.deleteCurrentUser();
    this.toast.success('Logged out succesfully! See you again soon :)');

  }

}
