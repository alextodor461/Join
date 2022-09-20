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

  testing: Task[] = [];

  done: Task[] = [];

  tasksWithHighPriority: Task[] = [];

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
      this.toDo = data.filter(e => e.state === 1); 

      //This array is assigned all the tasks whose state is "in Progress".
      this.inProgress = data.filter(e => e.state === 2); 

      //This array is assigned all the tasks whose state is "testing".
      this.testing = data.filter(e => e.state === 3);
      
      //This array is assigned all the tasks whose state is "done".
      this.done = data.filter(e => e.state === 4);
      
      //This array is assigned all the tasks whose priority is "high".
      this.tasksWithHighPriority = data.filter(e => e.priority === 3); 

    });

  }

}
