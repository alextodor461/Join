import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/models/task';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.getCurrentUser().access_token;

    req = req.clone({

      setHeaders: {
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': `Token ${token}`,
      }

    });

    return next.handle(req);

  }

}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl: string = "https://vicentbotellaferragud.pythonanywhere.com/tasks/";

  constructor(private http: HttpClient) { }

  /**
   * GET method: fetches all the tasks from the server.
   * @returns - all the tasks from the server.
   */
  public getAllTasks(): Observable<Task[]> {

    return this.http.get<Task[]>(this.baseUrl);

  }

  /**
   * GET method: fetches the passed-in task from the server.
   * @param id - This is the passed-in task's id. The function needs it to fetch the right task from the server.
   * @returns - the passed-in task from the server.
   */
  public getTaskById(id: any): Observable<Task> {

    return this.http.get<Task>(`${this.baseUrl}/${id}/`);

  }

  /**
   * POST method: creates a new task on the server.
   * @param task - This is the passed-in task (the to-be-created task).
   * @returns - the recently created task from the server.
   */
  public createTask(task: Task): Observable<Task> {
    
    return this.http.post<Task>(this.baseUrl, task);

  }

  /**
   * PUT method: updates an existing task on the server.
   * @param id - This is the passed-in task's id. The function needs it to update the right task on the server.
   * @param task - This is the passed-in task. The function needs it to update the to-be-updated task info.
   * @returns - the recently updated task from the server.
   */
  public updateTask(id: number, task: Task): Observable<Task> {

    return this.http.put<Task>(`${this.baseUrl}/${id}/`, task);

  }

  /**
   * DELETE method: deletes an existing task from the server.
   * @param id - This is the passed-in task's id. The function needs it to delete the right task from the server.
   * @returns - a message confirming the task deletion.
   */
  public deleteTask(id: number): Observable<string> {

    return this.http.delete<string>(`${this.baseUrl}/${id}/`);

  }

}
