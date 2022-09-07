import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = "https://vicentbotellaferragud.pythonanywhere.com/api";

  constructor(private http: HttpClient) { }

  public getAllUsers(): Observable<User[]> {

    const userListEndpoint = "user-list/";

    return this.http.get<User[]>(`${this.baseUrl}/${userListEndpoint}`); 

  }

  public getUserById(id: any): Observable<User> {

    const userToGetEndpoint = `user-detail/${id}`;

    return this.http.get<User>(`${this.baseUrl}/${userToGetEndpoint}`); 

  }

  public createUser(user: User): Observable<User[]> {

    const userCreationEndpoint = "user-create/";
    
    return this.http.post<User[]>(`${this.baseUrl}/${userCreationEndpoint}`, user);

  }

  public updateUser(id: number, user: User): Observable<User[]> {

    const userToUpdateEndpoint = `user-update/${id}`;
    
    return this.http.put<User[]>(`${this.baseUrl}/${userToUpdateEndpoint}`, user);

  }

  public deleteUser(id: number): Observable<User[]> {

    const userToDeleteEndpoint = `user-update/${id}`;
    
    return this.http.delete<User[]>(`${this.baseUrl}/${userToDeleteEndpoint}`);

  }

}
