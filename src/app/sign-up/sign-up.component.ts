import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private toast: HotToastService,
    private userService: UserService
  ) { }

  ngOnInit(): void { }

  get username() {

    return this.signupForm.get('username');

  }

  get password() {

    return this.signupForm.get('password');

  }

  get confirmPassword() {

    return this.signupForm.get('confirmPassword');

  }

  checkPasswordsMatch() {

    const passwordCurrentValue = this.password?.value;
    const confirmPasswordCurrentValue = this.confirmPassword?.value;

    if (passwordCurrentValue.length && confirmPasswordCurrentValue.length) {

      return this.password?.value === this.confirmPassword?.value;

    } else {

      return true;

    }

  }

  submit() {

    const newUser = new User();

    newUser.username = this.username?.value;
    newUser.password = this.password?.value;

    this.userService.createUser(newUser).subscribe((data: User[] | string) => {

      if (data === `There is already one user with the username '${newUser.username}'.`) {
        
        this.unsuccessfulResgistration();

      } else {

        this.successfulResgistration();

      }

    });

  }

  successfulResgistration() {

    this.toast.success('New user succesfully created!');
    this.router.navigate(['/login']);

  }

  unsuccessfulResgistration() {

    this.toast.error(`There is already one user with the username '${this.username?.value}'.`);

  }

}
