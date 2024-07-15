import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private apiUrl = 'http://localhost:3000';
  private menuItemsUrl = `${this.apiUrl}/menuItems`;
  private authLinksUrl = `${this.apiUrl}/authLinks`;

  constructor(private http: HttpClient) { }

  getMenuItems(): Observable<any> {
    return this.http.get<any>(this.menuItemsUrl);
  }

  getAuthLinks(): Observable<any> {
    return this.http.get<any>(this.authLinksUrl);
  }
}
