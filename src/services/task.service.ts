import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private url: string = "https://vicentbotellaferragud.pythonanywhere.com/api/task-list/";

  constructor(private http: HttpClient) { }

  public getAllTaks(): Observable<Task[]> {

    return this.http.get<Task[]>(this.url);

  }

}
