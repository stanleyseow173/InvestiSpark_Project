import { ViewportScroller } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';
import { User } from 'app/models';
import { StorageService } from 'app/_services/storage.service';
import { UserService } from 'app/_services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{
  data : Date = new Date();
  focus;
  focus1;
  
  currentUser: User;
  
  constructor(
    private storageService: StorageService,
    private viewportScroller: ViewportScroller,
    private userService: UserService) { }

  appSvc = inject(AppService)

  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    const sub = this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
    })
    this.subscriptions.add(sub);

    const user = this.storageService.getUser();
    this.userService.setCurrentUser(user);
  }

  public scrollToAnchoringPosition(elementId: string):void{
    this.viewportScroller.scrollToAnchor(elementId);
  }

  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');

    this.subscriptions.unsubscribe()
  }
}
