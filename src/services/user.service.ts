import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = "https://vicentbotellaferragud.pythonanywhere.com/users/";

  private registrationUrl: string = "https://vicentbotellaferragud.pythonanywhere.com/users/register/";

  constructor(private http: HttpClient) { }

  /**
   * GET method: fetches all the users from the server.
   * @returns - all the users from the server.
   */
  public getAllUsers(): Observable<User[]> {

    return this.http.get<User[]>(this.baseUrl);

  }

  /**
   * GET method: fetches the passed-in user from the server.
   * @param id - This is the passed-in user's id. The function needs it to fetch the right user from the server.
   * @returns - the passed-in user from the server.
   */
  public getUserById(id: any): Observable<User> {

    return this.http.get<User>(`${this.baseUrl}/${id}`);

  }

  /**
   * POST method: creates a new user on the server.
   * @param user - This is the passed-in user (the to-be-created user).
   * @returns - the recently created user from the server.
   */
  public createUser(user: User): Observable<User> {

    return this.http.post<User>(this.registrationUrl, user);

  }

  /**
   * DELETE method: deletes an existing user from the server.
   * @param id - This is the passed-in user's id. The function needs it to delete the right user from the server.
   * @returns - a message confirming the user deletion.
   */
  public deleteUser(id: number): Observable<string> {

    return this.http.delete<string>(`${this.baseUrl}/${id}`);

  }

}
