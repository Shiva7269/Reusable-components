import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Check if localStorage is available
    if (typeof localStorage !== 'undefined') {
        // Retrieve the token from local storage
        const authToken = localStorage.getItem('authToken');
        
        // If the token exists, clone the request and set the Authorization header
        if (authToken) {
            const clonedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${authToken}`),
            });
            
            // Forward the cloned request with the token
            return next(clonedReq);
        }
    }
    
    // If no token, or localStorage is not available, forward the request as it is
    return next(req);
};
