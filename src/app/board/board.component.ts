import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from 'src/services/task.service';
import { Task } from 'src/models/task';
import { UserService } from 'src/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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

  awaitingFeedback: Task[] = [];

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
    private toast: HotToastService,
    private router: Router
  ) { }

  /**
   * Gets all the tasks from the server by calling the getAllTasks function from the task service -and assigns the obtained data
   * to the local array "tasks"-, retrieves the route parameter (if any) -and assigns it to the local variable "recentlyCreatedTaskId" 
   * and "listens" for value changes in the taskSearch form control to update the local array "filteredTasks".
   */
  ngOnInit(): void {

    this.taskService.getAllTasks().pipe(takeUntil(this.destroy)).subscribe((data: Task[] | string) => {

      if (typeof data !== "string") { //Meaning: if the response from the server is NOT "The task list is empty."...

        this.tasks = data;
        this.sortTasks();
        this.tasksLoaded = true;

      }

    });

    this.route.paramMap.subscribe((params: ParamMap) => {

      if (params) {

        let id = Number(params.get("taskId"));
        this.recentlyCreatedTaskId = id;

      }

    });

    this.searchForm.get("taskSearch")?.valueChanges.subscribe((data: string) => {

      if (data.length) { //Meaning: if the search input infield is not empty...

        this.filteredTasks = this.tasks.filter(task => (task.title.toLowerCase()).includes(data.toLowerCase()));

      } else {

        this.filteredTasks = [];

      }

    });

  }

  /**
   * Checks if the local array "filteredTasks" contains the passed-in task.
   * @param task - This is the passed-in Task.
   * @returns - "true" or "false", depending on whether the passed-in task is included in the local array "filteredTasks" or not.
   */
  includedInFilteredTasks(task: Task) {

    return this.filteredTasks.includes(task);

  }

  /**
   * Sorts all task into 4 subarrays according to their state.
   */
  sortTasks() {

    for (let i = 0; i < this.tasks.length; i++) {

      const element = this.tasks[i];

      if (element.state === "To Do") {

        this.toDo.push(element);

      } else if (element.state === "In Progress") {

        this.inProgress.push(element);

      } else if (element.state === "Awaiting Feedback") {

        this.awaitingFeedback.push(element);

      } else {

        this.done.push(element);

      }

    }

  }

  /**
   * Checks if the passed-in task id has the same value as the local variable "recentlyCreatedTaskId".
   * @param item - This is the passed-in item (task).
   * @returns - "true" or "false", depending on whether the passed-in task id has the same value as the local variable 
   * "recentlyCreatedTaskId" or not.
   */
  recentlyCreatedTask(item: Task) {

    return this.recentlyCreatedTaskId === item.id;

  }

  /**
   * Every time a task is moved (from one list/group/state to another) calls the updateTask function from the task service to update 
   * the state of the passed-in task (this is contained within the event parameter).
   * @param event - This is the event that contains, among other things, the info of the to-be-moved task as well as the info of the
   * destination list/group/state.
   */
  drop(event: CdkDragDrop<Task[]>) {

    if (event.previousContainer === event.container) { //Meaning: if the passed-in task is moved within its state (within its group)...

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const containerName = event.container.element.nativeElement.className;

      if (containerName.includes("list-1")) {

        const movedTask = this.tasks.find(task => (event.item.element.nativeElement.innerText).slice(0, -10) === task.title);

        if (movedTask) {

          movedTask.state = "To Do";

          this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

            const assignee = data.find(user => user.id === movedTask.assignee);
            const creator = data.find(user => user.id === movedTask.creator);

            if (assignee && creator) {

              movedTask.assignee = assignee?.id;
              movedTask.creator = creator?.id;

              this.taskService.updateTask(movedTask.id, movedTask).pipe(takeUntil(this.destroy)).subscribe((data: Task) => {

                console.log(data);

              });

            }

          });

        }

      } else if (containerName.includes("list-2")) {

        const movedTask = this.tasks.find(task => (event.item.element.nativeElement.innerText).slice(0, -10) === task.title);

        if (movedTask) {

          movedTask.state = "In Progress";

          this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

            const assignee = data.find(user => user.id === movedTask.assignee);
            const creator = data.find(user => user.id === movedTask.creator);

            if (assignee && creator) {

              movedTask.assignee = assignee?.id;
              movedTask.creator = creator?.id;

              this.taskService.updateTask(movedTask.id, movedTask).pipe(takeUntil(this.destroy)).subscribe((data: Task) => {

                console.log(data);

              });

            }

          });

        }

      } else if (containerName.includes("list-3")) {

        const movedTask = this.tasks.find(task => (event.item.element.nativeElement.innerText).slice(0, -10) === task.title);

        if (movedTask) {

          movedTask.state = "Awaiting Feedback";

          this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

            const assignee = data.find(user => user.id === movedTask.assignee);
            const creator = data.find(user => user.id === movedTask.creator);

            if (assignee && creator) {

              movedTask.assignee = assignee?.id;
              movedTask.creator = creator?.id;

              this.taskService.updateTask(movedTask.id, movedTask).pipe(takeUntil(this.destroy)).subscribe((data: Task) => {

                console.log(data);

              });

            }

          });

        }

      } else {

        const movedTask = this.tasks.find(task => (event.item.element.nativeElement.innerText).slice(0, -10) === task.title);

        if (movedTask) {

          movedTask.state = "Done";

          this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

            const assignee = data.find(user => user.id === movedTask.assignee);
            const creator = data.find(user => user.id === movedTask.creator);

            if (assignee && creator) {

              movedTask.assignee = assignee?.id;
              movedTask.creator = creator?.id;

              this.taskService.updateTask(movedTask.id, movedTask).pipe(takeUntil(this.destroy)).subscribe((data: Task) => {

                console.log(data);

              });

            }

          });

        }

      }

    }

  }

  /**
   * Opens the DialogSeeTaskDetailsComponent and passes all the passed-in task properties to it (as a data object).
   * @param task - This is the passed-in task.
   */
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

  /**
   * Opens the DialogEditTaskComponent, passes all the passed-in task properties to it (as a data object) and, when this is closed,
   * calls the refreshPage function and displays a successful task edition message.
   * @param task - This is the passed-in task.
   */
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

    dialogRef.afterClosed().subscribe((data: Task) => {

      if (data) {

        this.refreshPage();
        this.toast.success("Task succesfully edited!");

      }

    });

  }

  /**
   * Opens the DialogDeleteTaskComponent, passes some propertis from the passed-in task properties to it (as a data object) and, when 
   * this is closed, calls the refreshPage function and displays a successful task deletion message.
   * @param task - This is the passed-in task.
   */
  deleteTask(task: Task) {

    const dialogRef = this.dialog.open(DialogDeleteTaskComponent, {

      data: {
        id: task.id,
        title: task.title,
      }

    });

    dialogRef.afterClosed().subscribe((data: string) => {

      if (data) {

        this.refreshPage();
        this.toast.success("Task succesfully deleted!");

      }

    });

  }

  /**
   * Refreshes the page.
   */
  refreshPage() {

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {

      this.router.navigate(['/board']);

    });

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
