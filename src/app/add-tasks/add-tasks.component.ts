import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Task } from 'src/models/task';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
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

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.checkProgressBarValue();

  }

  checkProgressBarValue() {

    const arrOfForms = new Array();

    arrOfForms.push(this.titleFormGroup.get("title")?.value);
    arrOfForms.push(this.descriptionFormGroup.get("description")?.value);
    arrOfForms.push(this.priorityFormGroup.get("priority")?.value);
    arrOfForms.push(this.completionDateFormGroup.get("completionDate")?.value);
    arrOfForms.push(this.assigneeFormGroup.get("assignee")?.value);

    let value = 0;

    for (let i = 0; i < arrOfForms.length; i++) {
      const element = arrOfForms[i];

      if (element !== "") {

        value += 20;
        
      }

    }

    return value;

  }

  createTask() {

    const newTask: Task = new Task();

    newTask.title = this.titleFormGroup.get("title")?.value;
    newTask.description = this.descriptionFormGroup.get("description")?.value;
    newTask.priority = this.priorityFormGroup.get("priority")?.value;
    newTask.completion_date = this.completionDateFormGroup.get("completionDate")?.value;

    console.log(newTask);

  }

}
