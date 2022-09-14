import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/models/task';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-dialog-delete-task',
  templateUrl: './dialog-delete-task.component.html',
  styleUrls: ['./dialog-delete-task.component.scss']
})
export class DialogDeleteTaskComponent implements OnInit {

  taskToDeleteId!: number;

  taskToDeleteTitle!: string;

  tasksAfterDeletion: Task[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task, 
    public dialogRef: MatDialogRef<DialogDeleteTaskComponent>,
    private taskService: TaskService
    ) { }

  ngOnInit(): void {
    
    this.taskToDeleteId = this.data.id;
    this.taskToDeleteTitle = this.data.title;

  }

  deleteTask(taskId: number) {

    this.taskService.deleteTask(taskId).subscribe((data: Task[]) => {

      this.tasksAfterDeletion = data;
      this.dialogRef.close(this.tasksAfterDeletion);

    });

  }


}
