import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Task } from 'src/models/task';
import { UserService } from 'src/services/user.service';
import { User } from 'src/models/user';
import { AuthenticationService } from 'src/services/authentication.service';
import { TaskService } from 'src/services/task.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

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
export class AddTasksComponent implements OnInit {

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

  constructor(
    private _formBuilder: FormBuilder, 
    private userService: UserService, 
    private authService: AuthenticationService,
    private taskService: TaskService,
    private toast: HotToastService,
    private router: Router
    ) { }

  ngOnInit(): void {

    this.userService.getAllUsers().subscribe((data: User[]) => {

      const usersExcludingGuest = data.filter(e => e.username !== "guest");
      this.users = usersExcludingGuest;

    });

  }

  get title() {

    return this.titleFormGroup.get("title");

  }

  get description() {

    return this.descriptionFormGroup.get("description");

  }

  get priority() {

    return this.priorityFormGroup.get("priority");

  }

  get completionDate() {

    return this.completionDateFormGroup.get("completionDate");

  }

  get assignee() {

    return this.assigneeFormGroup.get("assignee");

  }

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

  getCurrentDate() {

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    let currentDate = yyyy + "-" + mm + "-" + dd;

    return currentDate;

  }

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

  createTask() {

    const newTask: Task = new Task();

    newTask.title = this.title?.value;
    newTask.description = this.description?.value;
    newTask.priority = this.priority?.value;
    newTask.state = 1;
    newTask.creation_date = this.getCurrentDate();
    newTask.completion_date = this.convertCompletionDate(this.completionDate?.value);
    newTask.assignee = this.assignee?.value;
    newTask.creator = this.authService.getCurrentUser().username;

    this.taskService.createTask(newTask).subscribe((data: Task[]) => {
      
      const recentlyCreatedTask = data[data.length - 1];
      this.successfulTaskCreation(recentlyCreatedTask);

    });

  }

  successfulTaskCreation(task: Task) {

    this.toast.success('New task succesfully created!');
    this.router.navigate(['/board', {taskId: task.id}]);

  }

}
