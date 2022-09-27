import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Task } from 'src/models/task';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-dialog-see-task-details',
  templateUrl: './dialog-see-task-details.component.html',
  styleUrls: ['./dialog-see-task-details.component.scss']
})
export class DialogSeeTaskDetailsComponent implements OnInit, OnDestroy {

  taskFromTheBoard: Task = new Task();

  destroy = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task,
    public dialogRef: MatDialogRef<DialogSeeTaskDetailsComponent>,
    private userService: UserService
  ) { }

  /**
   * Assigns to the local variable "taskFromTheBoard" all the data properties (data comes from the board component) so that the
   * template can make use of these.
   */
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

  }

  /**
   * By calling the getUserById function from the user service (and of course making use of the passed-in id) gets the assignee/creator 
   * username.
   * @param id - This is the passed-in id.
   * @param assigneeOrCreator - This is the assignee or the creator. Depending on what we want to get, assignee or creator username, we 
   * will pass in "assignee" or "creator".
   * IMPORTANT! --> This function is needed because both the assignee and the creator have a numeric value on the server and we want
   * the users to see their usernames and not their numeric values.
   */
  getAssigneeOrCreator(id: number | string, assigneeOrCreator: string) {

    Number(id);

    this.userService.getUserById(id).pipe(takeUntil(this.destroy)).subscribe((data: User) => {

      assigneeOrCreator === "assignee" ? this.taskFromTheBoard.assignee = data.username : this.taskFromTheBoard.creator = data.username;

    });

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
