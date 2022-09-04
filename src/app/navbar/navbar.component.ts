import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  summaryBtn: any = true;
  boardBtn: any = false;
  addTaskBtn: any = false;
  contactBtn: any = false;

  constructor() { }

  ngOnInit(): void {
  }

  showSummary(){
    this.summaryBtn = true;
    this.boardBtn = false;
    this.addTaskBtn = false;
    this.contactBtn = false;
  }

  showBoard(){
    this.summaryBtn = false;
    this.boardBtn = true;
    this.addTaskBtn = false;
    this.contactBtn = false;
  }

  showAddTask(){
    this.summaryBtn = false;
    this.boardBtn = false;
    this.addTaskBtn = true;
    this.contactBtn = false;
  }

  showContact(){
    this.summaryBtn = false;
    this.boardBtn = false;
    this.addTaskBtn = false;
    this.contactBtn = true;
  }
}
