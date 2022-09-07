import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'src/models/user';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private toast: HotToastService,
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void { }

  get username() {

    return this.loginForm.get('username');

  }

  get password() {

    return this.loginForm.get('password');

  }

  submit() {

    this.userService.getAllUsers().subscribe((data: User[]) => {

      const userFromTheDb = data.find((user: User) => user.username === this.username?.value && user.password === this.password?.value);

      if (userFromTheDb) {

        this.authService.currentUser = userFromTheDb;
        this.successfulLogin();

      } else {

        this.unsuccessfulLogin();

      }

    });

  }

  successfulLogin() {

    this.toast.success('Logged in succesfully!');
    this.router.navigate(['/summary']);

  }

  unsuccessfulLogin() {

    this.toast.error('Invalid username or password.');

  }

}
