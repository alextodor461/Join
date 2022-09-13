import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl: string = "https://vicentbotellaferragud.pythonanywhere.com/api";

  constructor(private http: HttpClient) { }

  public getAllTaks(): Observable<Task[]> {

    const taskListEndpoint = "task-list/";

    return this.http.get<Task[]>(`${this.baseUrl}/${taskListEndpoint}`);

  }

  public getTaskById(id: any): Observable<Task> {

    const taskToGetEndpoint = `task-detail/${id}`;

    return this.http.get<Task>(`${this.baseUrl}/${taskToGetEndpoint}`);

  }

  public createTask(task: Task): Observable<Task[]> {

    const taskCreationEndpoint = "task-create/";
    
    return this.http.post<Task[]>(`${this.baseUrl}/${taskCreationEndpoint}`, task);

  }

  public updateTask(id: number, task: Task): Observable<Task[]> {

    const taskToUpdateEndpoint = `task-update/${id}/`;

    return this.http.put<Task[]>(`${this.baseUrl}/${taskToUpdateEndpoint}`, task);

  }

  public deleteTask(id: number): Observable<Task[]> {

    const taskToDeleteEndpoint = `task-delete/${id}`;

    return this.http.delete<Task[]>(`${this.baseUrl}/${taskToDeleteEndpoint}`);

  }

}
