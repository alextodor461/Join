import { Component, OnInit } from '@angular/core';
import { Task } from 'src/models/task';
import { AuthenticationService } from 'src/services/authentication.service';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  tasks: Task[] = [];

  toDo: Task[] = [];

  inProgress: Task[] = [];

  awaitingFeedback: Task[] = [];

  done: Task[] = [];

  tasksWithHighPriority: Task[] = [];

  tasksOrderedbyCompletionDate: Task[] = [];

  constructor(public authService: AuthenticationService, private taskService: TaskService) { }

  /**
   * Gets all the tasks from the server by calling the getAllTasks function from the task service and filters the obtained data
   * so that each of the local arrays is assigned its corresponding tasks.
   */
  ngOnInit(): void {

    this.taskService.getAllTasks().subscribe((data: Task[]) => {

      //This array is assigned all the tasks.
      this.tasks = data;

      //This array is assigned all the tasks whose state is "To Do".
      this.toDo = data.filter(e => e.state === "To Do");

      //This array is assigned all the tasks whose state is "In Progress".
      this.inProgress = data.filter(e => e.state === "In Progress");

      //This array is assigned all the tasks whose state is "Awaiting Feedback".
      this.awaitingFeedback = data.filter(e => e.state === "Awaiting Feedback");

      //This array is assigned all the tasks whose state is "Done".
      this.done = data.filter(e => e.state === "Done");

      //This array is assigned all the tasks whose priority is "high".
      this.tasksWithHighPriority = data.filter(e => e.priority === "Urgent");

      //This array is assigned all the tasks, but sorted in ascending order based on the completion date value parameter of each task.
      this.tasksOrderedbyCompletionDate = this.orderTasksByCompletionDate(data);

    });

  }

  /**
   * Assigns a new completion date value (which is obtained from the getCompletionDateValue function) to each task of the passed-in 
   * tasks array and then sorts it (the array) in ascending order based on this new completion date value parameter.
   * @param tasks - This is the passed-in tasks array.
   * @returns - The passed-in tasks array sorted in ascending order based on the completion date value parameter of each task.
   */
  orderTasksByCompletionDate(tasks: any) {

    tasks.forEach((task: any) => {

      const completionDateValue: number = this.getCompletionDateValue(task.completion_date);
      task.completion_date = completionDateValue;

    });

    tasks.sort((a: any, b: any) => a.completion_date - b.completion_date);

    return tasks;

  }

  /**
   * Converts the passed-in completion date into a numeric value.
   * @param completionDate - This is the passed-in completion date.
   * @returns - the numeric value that corresponds to the passed-in completion date.
   */
  getCompletionDateValue(completionDate: any) {

    const arr = completionDate.split("-");

    const year = Number(arr[0]);
    const month = Number(arr[1]);
    const day = Number(arr[2]);

    const completionDateValue = year * 100 + month * 100 + day;

    return completionDateValue;

  }

}
