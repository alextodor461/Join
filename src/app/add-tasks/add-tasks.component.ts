import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Task } from 'src/models/task';
import { UserService } from 'src/services/user.service';
import { User } from 'src/models/user';
import { AuthenticationService } from 'src/services/authentication.service';
import { TaskService } from 'src/services/task.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    }
  ]
})
export class AddTasksComponent implements OnInit, OnDestroy {

  titleFormGroup = this._formBuilder.group({
    title: ['', Validators.required],
  });

  descriptionFormGroup = this._formBuilder.group({
    description: ['', Validators.required],
  });

  priorityFormGroup = this._formBuilder.group({
    priority: ['', Validators.required],
  });

  completionDateFormGroup = this._formBuilder.group({
    completionDate: ['', Validators.required],
  });

  assigneeFormGroup = this._formBuilder.group({
    assignee: ['', Validators.required],
  });

  users: User[] = [];

  destroy = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService,
    private taskService: TaskService,
    private toast: HotToastService,
    private router: Router
  ) { }

  /**
   * Gets all the users from the server by calling the getAllUsers function from the user service. It then excludes the "guest" user
   * object from the data (this is done because the users are needed for the assignee form control and we do not want the "guest" user
   * to be one of the possible assignees).
   */
  ngOnInit(): void {

    this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

      const usersExcludingGuest = data.filter(e => e.username !== "guest");
      this.users = usersExcludingGuest;

    });

  }

  /**
   * Gets the title form control.
   */
  get title() {

    return this.titleFormGroup.get("title");

  }

  /**
   * Gets the description form control.
   */
  get description() {

    return this.descriptionFormGroup.get("description");

  }

  /**
   * Gets the priority form control.
   */
  get priority() {

    return this.priorityFormGroup.get("priority");

  }

  /**
   * Gets the completionDate form control.
   */
  get completionDate() {

    return this.completionDateFormGroup.get("completionDate");

  }

  /**
   * Gets the assignee form control.
   */
  get assignee() {

    return this.assigneeFormGroup.get("assignee");

  }

  /**
   * Iterates over a form controls array and adds 20 to the "progressBarValue" variable each time any of the form controls is valid.
   * @returns - a value between 0 and 100, depending on how many form controls are valid (meaning: depending on how many form controls 
   * are filled in).
   */
  checkProgressBarValue() {

    const forms = new Array();
    forms.push(this.title, this.description, this.priority, this.completionDate, this.assignee);

    let progressBarValue = 0;

    for (let i = 0; i < forms.length; i++) {

      if (forms[i].valid) {

        progressBarValue += 20;

      }

    }

    return progressBarValue;

  }

  /**
   * Gets the current date in yyyy-mm-dd format.
   * @returns - the current date in yyyy-mm-dd format.
   */
  getCurrentDate() {

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    let currentDate = yyyy + "-" + mm + "-" + dd;

    return currentDate;

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
   * Taking the values of all form controls + the current date + the current user (the user that is logged in) creates a new task
   * object on the server (it does it by calling the createTask function from the task service). It then stores the recently created 
   * task in a variable.
   */
  createTask() {

    const newTask: Task = new Task();

    newTask.title = this.title?.value;
    newTask.description = this.description?.value;
    newTask.priority = this.priority?.value;
    newTask.state = "To Do"; //This is hard-coded data, because we want the task to always have a "To Do" state at first.
    newTask.creation_date = this.getCurrentDate();
    newTask.completion_date = this.convertCompletionDate(this.completionDate?.value);
    newTask.assignee = this.assignee?.value;
    newTask.creator = this.authService.getCurrentUser().user.id;

    this.taskService.createTask(newTask).pipe(takeUntil(this.destroy)).subscribe((data: Task) => {

      const recentlyCreatedTask = data;
      this.successfulTaskCreation(recentlyCreatedTask);

    });

  }

  /**
   * Displays a successful task creation message and navigates the user to the board view, passing to the URL the task id of the
   * passed-in task as a route parameter. This way the board component can make use of this route parameter to highlight the recently
   * created task.
   * @param task - This is the passed-in task.
   */
  successfulTaskCreation(task: Task) {

    this.toast.success('New task succesfully created!');
    this.router.navigate(['/board', { taskId: task.id }]);

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
