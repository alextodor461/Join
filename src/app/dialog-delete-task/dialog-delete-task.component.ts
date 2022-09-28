import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Task } from 'src/models/task';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-dialog-delete-task',
  templateUrl: './dialog-delete-task.component.html',
  styleUrls: ['./dialog-delete-task.component.scss']
})
export class DialogDeleteTaskComponent implements OnInit, OnDestroy {

  taskToDeleteId!: number;

  taskToDeleteTitle!: string;

  destroy = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task,
    public dialogRef: MatDialogRef<DialogDeleteTaskComponent>,
    private taskService: TaskService
  ) { }

  /**
   * Assigns to the local variables "taskToDeleteId" and "taskToDeleteTitle" the data properties (data comes from the board component) 
   * so that the template can make use of these.
   */
  ngOnInit(): void {

    this.taskToDeleteId = this.data.id;
    this.taskToDeleteTitle = this.data.title;

  }

  /**
   * Calls the deleteTask function from the task service to delete the task that corresponds to the passed-in id and then closes the
   * dialog, passing to the board component the data obtained after deleting that task (a message confirming the task deletion).
   * @param taskId - This is the passed-in task id.
   */
  deleteTask(taskId: number) {

    this.taskService.deleteTask(taskId).pipe(takeUntil(this.destroy)).subscribe((data: string) => {

      this.dialogRef.close(data);

    });

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
