import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from 'src/services/task.service';
import { Task } from 'src/models/task';
import { UserService } from 'src/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];

  destroy = new Subject();

  constructor(private taskService: TaskService, private userService: UserService) { }

  ngOnInit(): void {

    this.taskService.getAllTaks().pipe(takeUntil(this.destroy)).subscribe((data) => {

      this.tasks = data;

    })

  }

  ngOnDestroy(): void {

    this.destroy.next(true);
    
  }

}
