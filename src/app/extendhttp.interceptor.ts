import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { LocalStorageService } from './services/local-storage.service';
import { projectConstantsLocal } from './constants/project-constants';
import { LeadsService } from './admin/leads/leads.service';
import { AuthService } from './auth.service';

@Injectable()
export class ExtendhttpInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private leadsService: LeadsService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) { }

  // intercept(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
  //   const authToken =
  //     this.localStorageService.getItemFromLocalStorage('accessToken');
  //   if (authToken) {
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     });
  //   }
  //   request = request.clone({
  //     url: request.url.startsWith('http')
  //       ? request.url
  //       : projectConstantsLocal.BASE_URL + request.url,
  //     responseType: 'json',
  //   });
  //   return next.handle(request).pipe(
  //     tap(
  //       () => {},
  //       // (error) => {
  //       //   if (error.status === 401) {
  //       //     this.router.navigate(['/login']);
  //       //   }
  //       // }
  //       (error) => {
  //         console.log(error);
  //         if (error.status === 401 || error.status === 419) {
  //           this.localStorageService.clearAllFromLocalStorage();
  //           this.router.navigate(['user', 'login']);
  //         }
  //       }
  //     )
  //   );
  // }


  // intercept(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
  //   const authToken =
  //     this.localStorageService.getItemFromLocalStorage('accessToken');
  //   const clientIp = this.localStorageService.getItemFromLocalStorage('clientIp') || '';
  //   if (authToken) {
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     });
  //   }
  //   request = request.clone({
  //     url: request.url.startsWith('http')
  //       ? request.url
  //       : projectConstantsLocal.BASE_URL + request.url,
  //     responseType: 'json',
  //     ...(request.url.startsWith('http')
  //       ? {}
  //       : {
  //           setHeaders: {
  //             'mysystem-IP': clientIp,
  //           },
  //         }),
  //   });
  //   return next.handle(request).pipe(
  //     tap(
  //       () => {},
  //       (error) => {
  //         console.log(error);
  //         if (error.status === 401 || error.status === 419) {
  //           this.localStorageService.clearAllFromLocalStorage();
  //           this.router.navigate(['user', 'login']);
  //         }
  //       }
  //     )
  //   );
  // }



  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.localStorageService.getItemFromLocalStorage('accessToken');
    const clientIp = this.localStorageService.getItemFromLocalStorage('clientIp') || '';

    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    }
    request = request.clone({
      url: request.url.startsWith('http')
        ? request.url
        : projectConstantsLocal.BASE_URL + request.url,
      responseType: 'json',
      ...(request.url.startsWith('http')
        ? {}
        : {
          setHeaders: {
            'mysystem-IP': clientIp,
          },
        }),
    });

    return next.handle(request).pipe(
      takeUntil(this.authService.cancelPendingRequests),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 419 || error.status === 401) {
          this.authService.triggerCancelPendingRequests(); // Cancel all pending/future requests
          this.authService.doLogout();
          this.localStorageService.clearAllFromLocalStorage();
          this.router.navigate(['user', 'login']);
        }
        return throwError(() => error);
      })
    );
  }
}
