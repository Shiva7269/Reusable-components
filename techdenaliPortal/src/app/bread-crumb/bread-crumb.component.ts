import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';


@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrl: './bread-crumb.component.scss'
})
export class BreadCrumbComponent {
  breadcrumbs: { label: string; url: string }[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        if (data['breadcrumbs']) {
          this.breadcrumbs = [];
          let currentRoute = this.activatedRoute.root;
          for (const breadcrumb of data['breadcrumbs']) {
            const url = currentRoute.snapshot.url.map((segment) => segment.path);
            this.breadcrumbs.push({ label: breadcrumb, url: `/${url}` });
            currentRoute = currentRoute.firstChild!;
          }
        }
      });
  }
}