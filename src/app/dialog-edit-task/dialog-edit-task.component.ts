import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Task } from 'src/models/task';
import { User } from 'src/models/user';
import { TaskService } from 'src/services/task.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-dialog-edit-task',
  templateUrl: './dialog-edit-task.component.html',
  styleUrls: ['./dialog-edit-task.component.scss']
})
export class DialogEditTaskComponent implements OnInit, OnDestroy {

  taskFromTheBoard: Task = new Task();

  users: User[] = [];

  editTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    completionDate: new FormControl('', [Validators.required]),
    assignee: new FormControl('', [Validators.required])
  });

  taskAfterEdition: Task = new Task();

  destroy = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task,
    public dialogRef: MatDialogRef<DialogEditTaskComponent>,
    private taskService: TaskService,
    private userService: UserService
  ) { }

  /**
   * Assigns to the local variable "taskFromTheBoard" all the data properties (data comes from the board component) so that the
   * template can make use of these. It also gets all the users from the server by calling the getAllUsers function from the user 
   * service. 
   * IMPORTANT! --> Like in the add-tasks component, the "guest" user is excluded from the data that comes from the server.
   */
  ngOnInit(): void {

    this.taskFromTheBoard.id = this.data.id;
    this.taskFromTheBoard.title = this.data.title;
    this.taskFromTheBoard.description = this.data.description;
    this.taskFromTheBoard.priority = this.data.priority;
    this.taskFromTheBoard.state = this.data.state;
    this.taskFromTheBoard.completion_date = this.data.completion_date;
    this.taskFromTheBoard.creation_date = this.data.creation_date;
    this.taskFromTheBoard.assignee = this.data.assignee;
    this.taskFromTheBoard.creator = this.data.creator;

    this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

      const usersExcludingGuest = data.filter(e => e.username !== "guest");
      this.users = usersExcludingGuest;

    });

    this.setFormValues();

  }

  /**
   * Gets the title form control.
   */
  get title() {

    return this.editTaskForm.get("title");

  }

  /**
   * Gets the description form control.
   */
  get description() {

    return this.editTaskForm.get("description");

  }

  /**
   * Gets the priority form control.
   */
  get priority() {

    return this.editTaskForm.get("priority");

  }

  /**
   * Gets the state form control.
   */
  get state() {

    return this.editTaskForm.get("state");

  }

  /**
   * Gets the completionDate form control.
   */
  get completionDate() {

    return this.editTaskForm.get("completionDate");

  }

  /**
   * Gets the assignee form control.
   */
  get assignee() {

    return this.editTaskForm.get("assignee");

  }

  /**
   * Sets all form control values from the editTask from group. In order to do this, it makes use of the local variable
   * "taskFromTheBoard" properties.
   */
  setFormValues() {

    this.title?.setValue(this.taskFromTheBoard.title);
    this.description?.setValue(this.taskFromTheBoard.description);
    this.priority?.setValue(this.taskFromTheBoard.priority);
    this.state?.setValue(this.taskFromTheBoard.state);
    this.completionDate?.setValue(this.taskFromTheBoard.completion_date);
    this.assignee?.setValue(this.taskFromTheBoard.assignee);

  }

  /**
   * Taking the values of all form controls + the taskFromTheBoard creation date + the taskFromTheBoard creator updates the task
   * object that corresponds to the passed-in id (you can find it in the updateTask function) on the server (it does it by 
   * calling the updateTask function from the task service). It then closes the dialog and passes to the board component the data 
   * obtained after updating that task (the recently updated task with the updated info).
   */
  saveChanges() {

    const editedTask: Task = new Task();

    const id = this.taskFromTheBoard.id;

    editedTask.title = this.title?.value;
    editedTask.description = this.description?.value;
    editedTask.priority = this.priority?.value;
    editedTask.state = this.state?.value;
    editedTask.creation_date = this.taskFromTheBoard.creation_date;
    editedTask.completion_date = (this.convertCompletionDate(this.completionDate?.value)).includes("undefined") ? this.taskFromTheBoard.completion_date : this.convertCompletionDate(this.completionDate?.value);
    editedTask.assignee = this.assignee?.value;
    editedTask.creator = this.taskFromTheBoard.creator;

    this.taskService.updateTask(id, editedTask).pipe(takeUntil(this.destroy)).subscribe((data: Task) => {

      this.taskAfterEdition = data;
      this.dialogRef.close(this.taskAfterEdition);

    });

  }

  /**
   * Converts the completion date into yyyy-mm-dd format.
   * @param data - This is the passed-in date.
   * @returns -the completion date into yyyy-mm-dd format.
   */
  convertCompletionDate(data: string) {

    let dateCut = (data.toString()).slice(4, 15);
    let arr = dateCut.split(" ");

    let yyyy = arr[2];
    let mm = arr[0];
    let dd = arr[1];

    let equivalenceArray = [
      ['Jan', '01'], ['Feb', '02'], ['Mar', '03'], ['Apr', '04'],
      ['May', '05'], ['Jun', '06'], ['Jul', '07'], ['Aug', '08'],
      ['Sep', '09'], ['Oct', '10'], ['Nov', '11'], ['Dec', '12']
    ];

    for (let i = 0; i < equivalenceArray.length; i++) {

      const element = equivalenceArray[i];
      const monthAsString = element[0];
      const monthAsNumber = element[1];

      if (monthAsString === mm) {
        mm = monthAsNumber;
      }

    }

    const convertedDate = yyyy + "-" + mm + "-" + dd;

    return convertedDate;

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
