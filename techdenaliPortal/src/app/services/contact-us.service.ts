import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  private apiUrl = environment.PUBLIC_URL;
  constructor(private http: HttpClient) { }
  saveContacts(formData :any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/contact_us`, formData);
  }
}