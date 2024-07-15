import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserModel } from '../models/user';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';


const localStorageAvailable = typeof localStorage !== 'undefined';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedInUser: any = null;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private router:Router) {
    if (localStorageAvailable) {
      const storedUser = localStorage.getItem('authToken');
      if (storedUser) {
        this.loadUserFromToken();
      }
    }
  }

  loadUserFromToken() {
    try {
      if (typeof localStorage !== 'undefined' && localStorage !== null) {
        this.loggedIn.next(true);
        const token = localStorage.getItem('authToken');
        if (token) {
          const decodedToken = jwtDecode<UserModel>(token);
          if (decodedToken) {
            console.log(decodedToken);
            this.loggedInUser = {
              userId: decodedToken.userId,
              privilege: decodedToken.privilege,
              userName: decodedToken.userName,
            };
          }
        }
      }
    } catch (error) {
      console.warn('localStorage is not available in the current environment:', error);
    }
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      this.loggedIn.next(false);
      localStorage.removeItem('authToken');
      this.router.navigate(['/login'])
    } else {
    }
    this.loggedInUser = null;
  }
  getLoggedUser(): UserModel | null {
    return this.loggedInUser;
  }
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}
