import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check if the code is running in the browser platform
  if (isPlatformBrowser(platformId)) {
    // Retrieve the token from local storage
    const token = localStorage.getItem('authToken');

    if (token) {
      // Token exists, user is authenticated
      return true;
    } else {
      // Token does not exist, redirect to the login page
      router.navigate(['/login']);
      return false;
    }
  } else {
    // Not running in the browser platform (e.g., server-side rendering)
    return false;
  }
}
