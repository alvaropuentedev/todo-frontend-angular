import { HttpRequest, HttpInterceptorFn, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: HttpRequest<any>,
  next: HttpHandlerFn
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  } else {
    return next(req);
  }
};
