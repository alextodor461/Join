import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = "https://vicentbotellaferragud.pythonanywhere.com/api";

  private registrationUrl: string = "https://vicentbotellaferragud.pythonanywhere.com/users/register/";

  constructor(private http: HttpClient) { }

  /**
   * GET method: fetches all the users from the server.
   * @returns - all the users from the server / a string if there are no users to fetch.
   */
  public getAllUsers(): Observable<User[]> {

    const userListEndpoint = "user-list/";

    return this.http.get<User[]>(`${this.baseUrl}/${userListEndpoint}`); 

  }

  /**
   * GET method: fetches the passed-in user from the server.
   * @param id - This is the passed-in user's id. The function needs it to fetch the right user from the server.
   * @returns - the passed-in user from the server.
   */
  public getUserById(id: any): Observable<User> {

    const userToGetEndpoint = `user-detail/${id}`;

    return this.http.get<User>(`${this.baseUrl}/${userToGetEndpoint}`); 

  }

  public createUser(user: User): Observable<User> {
    
    return this.http.post<User>(this.registrationUrl, user);

  }

  /**
   * PUT method: updates an existing user on the server.
   * @param id - This is the passed-in user's id. The function needs it to update the right user on the server.
   * @param user - This is the passed-in user. The function needs it to update the to-be-updated user info.
   * @returns - all the users from the server.
   */
  public updateUser(id: number, user: User): Observable<User[]> {

    const userToUpdateEndpoint = `user-update/${id}/`;
    
    return this.http.put<User[]>(`${this.baseUrl}/${userToUpdateEndpoint}`, user);

  }

  /**
   * DELETE method: deletes an existing user from the server.
   * @param id - This is the passed-in user's id. The function needs it to delete the right user from the server.
   * @returns - all the users from the server.
   */
  public deleteUser(id: number): Observable<User[]> {

    const userToDeleteEndpoint = `user-delete/${id}/`;
    
    return this.http.delete<User[]>(`${this.baseUrl}/${userToDeleteEndpoint}`);

  }

}
