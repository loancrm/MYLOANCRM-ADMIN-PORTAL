// import { Injectable } from '@angular/core';
// import { CanActivate, Router, UrlTree } from '@angular/router';
// import { AuthService } from './auth.service';
// import { LocalStorageService } from './services/local-storage.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   userType: any;
//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private localStorage: LocalStorageService
//   ) {
//     this.userType = this.localStorage.getItemFromLocalStorage('userType');
//   }

//   canActivate(): boolean | UrlTree {
//     console.log('this.authService.isLoggedIn()', this.authService.isLoggedIn());
//     if (this.authService.isLoggedIn()) {
//       this.router.createUrlTree(['/user/dashboard']);
//       return true;
//     } else {
//       return this.router.createUrlTree(['/user/login']);
//     }
//   }
// }



import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from './services/local-storage.service';
import { Observable, of } from 'rxjs';
import { LeadsService } from './admin/leads/leads.service';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  userType: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private leadService: LeadsService,

    private localStorage: LocalStorageService
  ) {
    this.userType = this.localStorage.getItemFromLocalStorage('userType');
  }
  canActivate(): Observable<boolean | UrlTree> {
    if (!this.authService.isLoggedIn()) {
      return of(this.router.createUrlTree(['/user/login']));
    }

    const userDetails = this.localStorage.getItemFromLocalStorage('userDetails');
    const accountId = userDetails?.user?.accountId;

    if (!accountId) {
      return of(this.router.createUrlTree(['/user/login']));
    }

    return this.leadService.getSubscriptionById(accountId).pipe(
      map((sub: any) => {
        // console.log("sub", sub)
        // ✅ Allow access if any plan is active (Free Trial, Basic, or Professional)
        if (sub?.status === 'Active' || sub?.status === 'Expired') {
          return true;
        } else {
          //   // ❌ Redirect to subscription page if not active
          return this.router.createUrlTree(['/user/choose-subscription']);
        }
      }),
      catchError(() => of(this.router.createUrlTree(['/user/choose-subscription'])))
    );
  }
}
