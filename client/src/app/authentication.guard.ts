import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { AuthService } from './_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  
  authService = inject(AuthService)

  constructor(private router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> |Promise<boolean | UrlTree> | boolean | UrlTree{
  
    return this.authService.checkAuthenticationStatus().pipe(
      tap(isAuthenticated => {
        if(isAuthenticated){
          return true;
        } else{
          return this.router.navigate(['/login']);
        }
    })
    )
    
  }
  
}