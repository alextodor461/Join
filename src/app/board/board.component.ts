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
import { DialogSeeTaskDetailsComponent } from '../dialog-see-task-details/dialog-see-task-details.component';
import { User } from 'src/models/user';
import { DialogEditTaskComponent } from '../dialog-edit-task/dialog-edit-task.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];

  filteredTasks: Task[] = [];

  recentlyCreatedTaskId!: number;

  toDo: Task[] = [];

  inProgress: Task[] = [];

  testing: Task[] = [];

  done: Task[] = [];

  tasksLoaded: boolean = false;

  searchForm = new FormGroup({
    taskSearch: new FormControl()
  });

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
        this.tasksLoaded = true;

      }

    })

    this.route.paramMap.subscribe((params: ParamMap) => {

      if (params) {

        let id = Number(params.get("taskId"));
        this.recentlyCreatedTaskId = id;

      }

    });

    this.searchForm.get("taskSearch")?.valueChanges.subscribe((data: string) => {

      this.filteredTasks = this.tasks.filter(task => (task.title.toLowerCase()).includes(data.toLowerCase()));
      console.log(this.filteredTasks);

    });
    
  }

  includedInFilteredTasks(task: Task) {

    return this.filteredTasks.includes(task);

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

      console.log(event.item.element.nativeElement.innerText);

    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      if (event.container.id === "cdk-drop-list-0") {

        const movedTask = this.tasks.find(task => (event.item.element.nativeElement.innerText).includes(task.title));

        if (movedTask) {

          movedTask.state = 1;

          this.userService.getAllUsers().subscribe((data: User[]) => {

            console.log(data);

            const assignee = data.find(user => user.id === movedTask.assignee);
            const creator = data.find(user => user.id === movedTask.creator);

            if (assignee && creator) {

              movedTask.assignee = assignee?.username;
              movedTask.creator = creator?.username;

              this.taskService.updateTask(movedTask.id, movedTask).subscribe((data: Task[]) => {

                console.log(data);
          
              });

            }

          });

        }

      } else if (event.container.id === "cdk-drop-list-1") {

        const movedTask = this.tasks.find(task => (event.item.element.nativeElement.innerText).includes(task.title));

        if (movedTask) {

          movedTask.state = 2;

          this.userService.getAllUsers().subscribe((data: User[]) => {

            console.log(data);

            const assignee = data.find(user => user.id === movedTask.assignee);
            const creator = data.find(user => user.id === movedTask.creator);

            if (assignee && creator) {

              movedTask.assignee = assignee?.username;
              movedTask.creator = creator?.username;

              this.taskService.updateTask(movedTask.id, movedTask).subscribe((data: Task[]) => {

                console.log(data);
          
              });

            }

          });

        }

      } else if (event.container.id === "cdk-drop-list-2") {

        const movedTask = this.tasks.find(task => (event.item.element.nativeElement.innerText).includes(task.title));

        if (movedTask) {

          movedTask.state = 3;

          this.userService.getAllUsers().subscribe((data: User[]) => {

            console.log(data);

            const assignee = data.find(user => user.id === movedTask.assignee);
            const creator = data.find(user => user.id === movedTask.creator);

            if (assignee && creator) {

              movedTask.assignee = assignee?.username;
              movedTask.creator = creator?.username;

              this.taskService.updateTask(movedTask.id, movedTask).subscribe((data: Task[]) => {

                console.log(data);
          
              });

            }

          });

        }

      } else {

        const movedTask = this.tasks.find(task => (event.item.element.nativeElement.innerText).includes(task.title));

        if (movedTask) {

          movedTask.state = 4;

          this.userService.getAllUsers().subscribe((data: User[]) => {

            console.log(data);

            const assignee = data.find(user => user.id === movedTask.assignee);
            const creator = data.find(user => user.id === movedTask.creator);

            if (assignee && creator) {

              movedTask.assignee = assignee?.username;
              movedTask.creator = creator?.username;

              this.taskService.updateTask(movedTask.id, movedTask).subscribe((data: Task[]) => {

                console.log(data);
          
              });

            }

          });

        }

      }

    }

  }

  seeTaskDetails(task: Task) {

    this.dialog.open(DialogSeeTaskDetailsComponent, {

      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        state: task.state,
        creation_date: task.creation_date,
        completion_date: task.completion_date,
        assignee: task.assignee,
        creator: task.creator
      }

    });

  }

  editTask(task: Task) {

    const dialogRef = this.dialog.open(DialogEditTaskComponent, {

      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        state: task.state,
        creation_date: task.creation_date,
        completion_date: task.completion_date,
        assignee: task.assignee,
        creator: task.creator
      }

    });

    dialogRef.afterClosed().subscribe((data: Task[]) => {

      if (data) {

        this.emptyAndRefillArrays(data);
        this.toast.success("Task succesfully edited!");  
        
      }

    });

  }

  deleteTask(task: Task) {

    const dialogRef = this.dialog.open(DialogDeleteTaskComponent, {

      data: {
        id: task.id,
        title: task.title,
      }

    });

    dialogRef.afterClosed().subscribe((data: Task[] | string) => {

      if (data) {

        if (typeof data !== "string") { //Meaning: if the response from the server is NOT "The task list is empty.".

          this.emptyAndRefillArrays(data);
          this.toast.success("Task succesfully deleted!");

        } else {

          this.emptyArrays();
          this.toast.success("Task succesfully deleted!");

        }

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
