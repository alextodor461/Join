import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Join';

  constructor(private router: Router) { }

  ngOnInit(): void { }

  checkNotLoginOrSignup() {

    const currentPath = this.router.url;

    if (currentPath === '/login' || currentPath === '/signup') {

      return false;

    } else {

      return true;
      
    }

  }

}
