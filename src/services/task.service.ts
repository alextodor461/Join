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

  /**
   * GET method: fetches all the tasks from the server.
   * @returns - all the tasks from the server / a string if there are no tasks to fetch.
   */
  public getAllTasks(): Observable<Task[]> {

    const taskListEndpoint = "task-list/";

    return this.http.get<Task[]>(`${this.baseUrl}/${taskListEndpoint}`);

  }

  /**
   * GET method: fetches the passed-in task from the server.
   * @param id - This is the passed-in task's id. The function needs it to fetch the right task from the server.
   * @returns - the passed-in task from the server.
   */
  public getTaskById(id: any): Observable<Task> {

    const taskToGetEndpoint = `task-detail/${id}/`;

    return this.http.get<Task>(`${this.baseUrl}/${taskToGetEndpoint}`);

  }

  /**
   * POST method: creates a new task on the server.
   * @param task - This is the passed-in task (the to-be-created task).
   * @returns - all the tasks from the server.
   */
  public createTask(task: Task): Observable<Task[]> {

    const taskCreationEndpoint = "task-create/";
    
    return this.http.post<Task[]>(`${this.baseUrl}/${taskCreationEndpoint}`, task);

  }

  /**
   * PUT method: updates an existing task on the server.
   * @param id - This is the passed-in task's id. The function needs it to update the right task on the server.
   * @param task - This is the passed-in task. The function needs it to update the to-be-updated task info.
   * @returns - all the tasks from the server.
   */
  public updateTask(id: number, task: Task): Observable<Task[]> {

    const taskToUpdateEndpoint = `task-update/${id}/`; //The last ULR "/" is necessary in order to avoid server errors.

    return this.http.put<Task[]>(`${this.baseUrl}/${taskToUpdateEndpoint}`, task);

  }

  /**
   * DELETE method: deletes an existing task from the server.
   * @param id - This is the passed-in task's id. The function needs it to delete the right task from the server.
   * @returns - all the tasks from the server.
   */
  public deleteTask(id: number): Observable<Task[]> {

    const taskToDeleteEndpoint = `task-delete/${id}/`;

    return this.http.delete<Task[]>(`${this.baseUrl}/${taskToDeleteEndpoint}`);

  }

}
