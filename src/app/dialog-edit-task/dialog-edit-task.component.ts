import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/models/task';
import { User } from 'src/models/user';
import { TaskService } from 'src/services/task.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-dialog-edit-task',
  templateUrl: './dialog-edit-task.component.html',
  styleUrls: ['./dialog-edit-task.component.scss']
})
export class DialogEditTaskComponent implements OnInit {

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

  tasksAfterEdition: Task[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task,
    public dialogRef: MatDialogRef<DialogEditTaskComponent>,
    private taskService: TaskService,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    this.taskFromTheBoard.id = this.data.id;
    this.taskFromTheBoard.title = this.data.title;
    this.taskFromTheBoard.description = this.data.description;
    this.taskFromTheBoard.priority = this.data.priority;
    this.taskFromTheBoard.state = this.data.state;
    this.taskFromTheBoard.completion_date = this.data.completion_date;
    this.taskFromTheBoard.creation_date = this.data.creation_date;

    this.getAssigneeOrCreator(this.data.assignee, "assignee");
    this.getAssigneeOrCreator(this.data.creator, "creator");

    this.userService.getAllUsers().subscribe((data: User[]) => {

      const usersExcludingGuest = data.filter(e => e.username !== "guest");
      this.users = usersExcludingGuest;

    });

  }

  get title() {

    return this.editTaskForm.get("title");

  }

  get description() {

    return this.editTaskForm.get("description");
    
  }

  get priority() {

    return this.editTaskForm.get("priority");
    
  }

  get state() {

    return this.editTaskForm.get("state");
    
  }

  get completionDate() {

    return this.editTaskForm.get("completionDate");
    
  }

  get assignee() {

    return this.editTaskForm.get("assignee");
    
  }

  getPriority(n: number) {

    if (n === 1) {

      return "Low";

    } else if (n === 2) {

      return "Medium";

    } else {

      return "High";

    }

  }

  getState(n: number) {

    if (n === 1) {

      return "To do";

    } else if (n === 2) {

      return "In Progress";

    } else if (n === 3) {

      return "Testing";

    } else {

      return "Done";

    }

  }

  getAssigneeOrCreator(id: number | string, assigneeOrCreator: string) {

    Number(id);

    this.userService.getUserById(id).subscribe((data: User) => {

      assigneeOrCreator === "assignee" ? this.taskFromTheBoard.assignee = data.username : this.taskFromTheBoard.creator = data.username;
      this.setFormValues();

    });

  }

  setFormValues() {

    this.title?.setValue(this.taskFromTheBoard.title);
    this.description?.setValue(this.taskFromTheBoard.description);
    this.priority?.setValue(this.taskFromTheBoard.priority);
    this.state?.setValue(this.taskFromTheBoard.state);
    this.completionDate?.setValue(this.taskFromTheBoard.completion_date);
    this.assignee?.setValue(this.taskFromTheBoard.assignee);

  }

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

    console.log(editedTask);

    this.taskService.updateTask(id, editedTask).subscribe((data: Task[]) => {

      this.tasksAfterEdition = data;
      this.dialogRef.close(this.tasksAfterEdition)

    });
    
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

}
