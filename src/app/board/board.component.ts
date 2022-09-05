import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/services/task.service';
import { Task } from 'src/models/task';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  tasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {

    this.taskService.getAllTaks().subscribe((data) => {

      console.log(data);

    })

  }

}
