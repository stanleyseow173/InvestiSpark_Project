import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'client';
  private _router: Subscription;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;

    private subscriptions: Subscription = new Subscription();


    constructor( private renderer : Renderer2, 
        private router: Router, 
        @Inject(DOCUMENT,) private document: any, 
        private element : ElementRef, 
        public location: Location, 
        private authService: AuthService)  {
            const sub = this.authService.checkAuthenticationStatus().subscribe()
            this.subscriptions.add(sub);
    }
    ngOnInit() {
        var navbar : HTMLElement = this.element.nativeElement.children[0].children[0];
        this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            if (window.outerWidth > 991) {
                window.document.children[0].scrollTop = 0;
            }else{
                window.document.activeElement.scrollTop = 0;
            }
            this.navbar.sidebarClose();

            this.renderer.listen('window', 'scroll', (event) => {
                const number = window.scrollY;
                var _location = this.location.path();
                _location = _location.split('/')[2];

                if (number > 40 || window.pageYOffset > 40) {
                    navbar.classList.remove('navbar-transparent');
                } else if (_location !== 'login' && this.location.path() !== '/nucleoicons') {
                    // remove logic
                    navbar.classList.add('navbar-transparent');
                }
            });
        });
    }

    ngOnDestroy(): void {
        this._router.unsubscribe();
        this.subscriptions.unsubscribe();
    }
}
