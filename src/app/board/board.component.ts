import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from 'src/services/task.service';
import { Task } from 'src/models/task';
import { UserService } from 'src/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteTaskComponent } from '../dialog-delete-task/dialog-delete-task.component';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];

  recentlyCreatedTaskId!: number;

  toDo: Task[] = [];

  inProgress: Task[] = [];

  testing: Task[] = [];

  done: Task[] = [];

  destroy = new Subject();

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {

    this.taskService.getAllTaks().pipe(takeUntil(this.destroy)).subscribe((data: Task[] | string) => {

      if (typeof data !== "string") { //Meaning: if the response from the server is NOT "The task list is empty.".

        this.tasks = data;
        this.sortTasks();

      }

    })

    this.route.paramMap.subscribe((params: ParamMap) => {

      if (params) {

        let id = Number(params.get("taskId"));
        this.recentlyCreatedTaskId = id;

      }

    });

  }

  sortTasks() {

    for (let i = 0; i < this.tasks.length; i++) {

      const element = this.tasks[i];

      if (element.state === 1) {

        this.toDo.push(element);

      } else if (element.state === 2) {

        this.inProgress.push(element);

      } else if (element.state === 3) {

        this.testing.push(element);

      } else {

        this.done.push(element);

      }

    }

  }

  recentlyCreatedTask(item: Task) {

    return this.recentlyCreatedTaskId === item.id;

  }

  drop(event: CdkDragDrop<Task[]>) {

    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

    }

  }

  deleteTask(task: Task) {

    const dialogRef = this.dialog.open(DialogDeleteTaskComponent, {

      data: {
        id: task.id,
        title: task.title,
      }

    });

    dialogRef.afterClosed().subscribe((data: Task[] | string) => {

      if (typeof data !== "string") { //Meaning: if the response from the server is NOT "The task list is empty.".

        this.emptyAndRefillArrays(data);
        this.toast.success("Task succesfully deleted!");
    
      } else {

        this.emptyArrays();
        this.toast.success("Task succesfully deleted!");

      }

    });

  }

  emptyArrays() {

    this.tasks = [];

    this.toDo = [];
    this.inProgress = [];
    this.testing = [];
    this.done = [];

  }

  emptyAndRefillArrays(data: Task[]) {

    this.tasks = data;

    this.toDo = [];
    this.inProgress = [];
    this.testing = [];
    this.done = [];

    this.sortTasks();

  }

  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
