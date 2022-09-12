import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/models/task';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-dialog-see-task-details',
  templateUrl: './dialog-see-task-details.component.html',
  styleUrls: ['./dialog-see-task-details.component.scss']
})
export class DialogSeeTaskDetailsComponent implements OnInit {

  taskFromBoard: Task = new Task();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task, 
    public dialogRef: MatDialogRef<DialogSeeTaskDetailsComponent>,
    private userService: UserService
    ) { }

  ngOnInit(): void { 

    this.taskFromBoard.id = this.data.id;
    this.taskFromBoard.title = this.data.title;
    this.taskFromBoard.description = this.data.description;
    this.taskFromBoard.state = this.data.state;
    this.taskFromBoard.completion_date = this.data.completion_date;
    this.taskFromBoard.creation_date = this.data.creation_date;
    
    this.getAssigneeOrCreator(this.data.assignee, "assignee");
    this.getAssigneeOrCreator(this.data.creator, "creator");

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

     assigneeOrCreator === "assignee" ? this.taskFromBoard.assignee = data.username : this.taskFromBoard.creator = data.username;
      
    });
  
  }

}
