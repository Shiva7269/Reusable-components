import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Data } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  breadcrumbs$: Observable<string[]> = this.breadcrumbsSubject.asObservable();

  constructor() { }

  setBreadcrumbs(route: ActivatedRouteSnapshot): void {
    const breadcrumbs: string[] = [];
    let currentRoute: ActivatedRouteSnapshot | null = route;

    while (currentRoute) {
      const data: Data = currentRoute?.routeConfig?.data || {};
      if (data['breadcrumb']) {
        breadcrumbs.unshift(data['breadcrumb']);
      }
      currentRoute = currentRoute.parent;
    }
    this.breadcrumbsSubject.next(breadcrumbs);
  }
}

