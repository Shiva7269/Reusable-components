import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User, UserModel } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.PUBLIC_URL;
  constructor(private http: HttpClient) { }
  //register api
  registerUser(formData: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/api/register`, formData, { responseType: 'text' });
}
//login api
loginUser(loginData: any): Observable<{ token: string, user: any }> {
  return this.http.post<{ token: string, user: any }>(`${this.apiUrl}/api/login`, loginData);
}
//delete api

  deleteUser(userId: string): Observable<void> {
    const url = `${this.apiUrl}/api/users/${userId}`;
    return this.http.delete<void>(url);
}
//user details api
getUsersDetails(): Observable<UserModel[]>{
  return this.http.get<UserModel[]>(`${this.apiUrl}/api/users`)
}


//toggle funtionality to active or inactive user
toggleUserStatus(userId: string): Observable<any> {
  const url = `${this.apiUrl}/api/users/${userId}/toggle-status`;
  return this.http.patch(url, null);
}
  
  
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/request-password-reset`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/reset-password/${token}`, { password });
  }

  tokenValidate(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/verify-reset-token/${token}`);
  }
  changePassword(userId: number,currentPassword:string, newPassword: string): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/api/change-password`, {userId:userId, currentPassword: currentPassword, newPassword: newPassword });
  }
}