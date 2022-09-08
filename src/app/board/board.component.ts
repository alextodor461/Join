import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/services/task.service';
import { Task } from 'src/models/task';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  tasks: Task[] = [];

  constructor(private taskService: TaskService, private userService: UserService) { }

  ngOnInit(): void {

    this.taskService.getAllTaks().subscribe((data) => {

      this.tasks = data;

    })

  }

}
