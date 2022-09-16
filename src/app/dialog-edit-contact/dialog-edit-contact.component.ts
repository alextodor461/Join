import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-dialog-edit-contact',
  templateUrl: './dialog-edit-contact.component.html',
  styleUrls: ['./dialog-edit-contact.component.scss']
})
export class DialogEditContactComponent implements OnInit, OnDestroy {

  editContactForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  destroy = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogEditContactComponent>,
    private toast: HotToastService
  ) { }

  /**
   * Using the data properties from the contacts component sets both form controls from the editContact from group.
   */
  ngOnInit(): void {

    this.username?.setValue(this.data.username);
    this.password?.setValue(this.data.password);

  }

  /**
   * Gets the username form control.
   */
  get username() {

    return this.editContactForm.get('username');

  }

  /**
   * Gets the password form control.
   */
  get password() {

    return this.editContactForm.get('password');

  }

  saveChanges() {

    const editedContact: User = new User();

    const id = this.data.id;

    editedContact.username = this.username?.value;
    editedContact.password = this.password?.value;

    this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

      const alreadyThisUsername = data.find((user: User) => user.username === editedContact.username);

      if (alreadyThisUsername) {

        this.dialogRef.close();
        this.toast.warning(`There is already one user with the username '${editedContact.username}'.`);
        
      } else {

        this.userService.updateUser(id, editedContact).subscribe((data: User[]) => {

          this.dialogRef.close(data);
    
        });
    
      }

    });

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
