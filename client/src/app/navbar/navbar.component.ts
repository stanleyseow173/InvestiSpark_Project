import { Component, OnInit, ElementRef, inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AppService } from 'app/app.service';
import { User, UserNavBar } from 'app/models';
import { StorageService } from 'app/_services/storage.service';
import { AuthService } from 'app/_services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/utils/confirm-dialog/confirm-dialog.component';
import { UserService } from 'app/_services/user.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
    private toggleButton: any;
    private sidebarVisible: boolean;

    private roles: string[] = [];
    isLoggedIn = false;
    showAdminBoard = false;
    showModeratorBoard = false;
    username?: string;

    currentUser: User;

    eventBusSub?: Subscription;

    appSvc = inject(AppService)

    loginBtn$ = this.appSvc.loginBtn;
    username$ = this.appSvc.currUser;

    emailImageUrl = new Subject<string>();

    private subscriptions: Subscription = new Subscription();

    constructor(
        public location: Location, 
        private element : ElementRef,  
        private router: Router,
        private storageService: StorageService,
        private authService: AuthService,
        private userService: UserService,
        public dialog: MatDialog
        
        ) {
        this.sidebarVisible = false;
    }
    

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.isLoggedIn = this.storageService.isLoggedIn();
        const sub = this.userService.currentUser.subscribe(user => {
            this.currentUser = user;
        })
        this.subscriptions.add(sub)

        if (this.isLoggedIn){
            const user = this.storageService.getUser();
            this.userService.setCurrentUser(user);
            this.roles = user.roles;
            this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
            this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
            this.username = user.username
            const sub2 = this.userService.getPhoto(user.email).subscribe(url =>
                this.emailImageUrl.next(url))
            this.subscriptions.add(sub2)
        }

        const sub3 = this.authService.userLoggedIn.subscribe((user: UserNavBar)=>{
            if(user.email){ //user logged in
                const sub4 = this.userService.getPhoto(user.email).subscribe(url =>{
                    this.emailImageUrl.next(url);
                    this.currentUser = this.storageService.getUser();
                  })
                  this.subscriptions.add(sub4);
            } else{ //user logged out
                console.info("no user")
                this.emailImageUrl.next(null);
            }
        })
        this.subscriptions.add(sub3)
    }

    
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
  
    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }

    navigateToProfile(){
        this.router.navigateByUrl('/user/'+this.currentUser.email)//.then(()=>{window.location.reload()})
    }

    login(){
        this.router.navigateByUrl('/login').then(()=>{window.location.reload()})
    }

    logout(){
        const dialogRef = this.dialog.open(ConfirmDialogComponent,{
            direction: 'rtl'
        });

        const sub5 = dialogRef.afterClosed().subscribe(result =>{
            if(result){
                const sub6 = this.authService.logout().subscribe({
                    next: res =>{
                        this.storageService.clean();
                        this.appSvc.setLoginBtn(true)
                        this.appSvc.setUser("");
                        this.router.navigateByUrl('/login').then(()=>{window.location.reload()})
                    },
                    error: err =>{
                        console.log(err);
                    }
                })
                this.subscriptions.add(sub6)
            }
        })
        this.subscriptions.add(sub5)
        
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe()
     }
}
