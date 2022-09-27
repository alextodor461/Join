import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';
import { UserPlusToken } from 'src/models/userPlusToken';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUserPlusToken!: UserPlusToken;

  private loginUrl: string = "https://vicentbotellaferragud.pythonanywhere.com/users/login/";

  constructor(private router: Router, private http: HttpClient) { }

  /**
   * Logs in the passed in user by making a post request to the loginUrl.
   * @param user - This is the passed-in user.
   * @returns - the logged-in user data plus his/her recently created token (it is created the moment the user is logged in).
   */
  public loginUser(user: User): Observable<UserPlusToken> {

    return this.http.post<UserPlusToken>(this.loginUrl, user);

  }

  /**
   * Stores the current user data and his/her token in the local storage.
   */
  public saveCurrentUser() {

    const currentUserPlusTokenAsText = JSON.stringify(this.currentUserPlusToken);
    localStorage.setItem('currentUserPlusTokenAsText', currentUserPlusTokenAsText);

  }

  /**
   * Gets the current user data and his/her token from the local storage.
   * IMPORTANT! --> This function is always called after the saveCurrentUser function. Therefore, there is always one user in the
   * local storage to retrieve.
   */
   public getCurrentUser() {

    const currentUserPlusTokenAsText = localStorage.getItem('currentUserPlusTokenAsText');

    if (currentUserPlusTokenAsText) {

      this.currentUserPlusToken = JSON.parse(currentUserPlusTokenAsText);
      
    }

    return this.currentUserPlusToken;

  }

  /**
   * Deletes the current user data and his/her token from the local storage and navigates him/her to the login view.
   */
   public deleteCurrentUser() {

    localStorage.removeItem('currentUserAsText');
    this.router.navigate(['/login']);

  }

}
