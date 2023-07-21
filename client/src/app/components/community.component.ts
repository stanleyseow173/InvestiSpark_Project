import { Component, OnDestroy, OnInit } from '@angular/core';
import { LinkPreviewData } from 'app/models';
import { PostService } from 'app/_services/post.service';
import { StorageService } from 'app/_services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { PostCreateDialogComponent } from './post-create-dialog.component';
import { UserService } from 'app/_services/user.service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { WatchlistService } from 'app/_services/watchlist.service';
import { UtilityService } from 'app/_services/utility.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit, OnDestroy{

  currentUser;
  userNames = new Map<string, string>();
  emailImageUrls = new Map<string, string>();

  followBtn = false;
  watchlistBtn = false;

  linkPreviewData: { [postId: string]: Observable<LinkPreviewData> } = {};
  
  posts$: Observable<any>;

  category = new FormControl('');
  tags: string[];
  tag = new FormControl('');


  private subscriptions: Subscription = new Subscription();

  constructor(private postService: PostService,
    private storageService: StorageService,
    private userService: UserService,
    private watchlistService: WatchlistService,
    private utilityService: UtilityService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    
    this.currentUser = this.storageService.getUser()
    
    //get all users in database - and get photos of each user and stores them in map
    const sub = this.userService.getAllUsers().subscribe(users =>{
      users.forEach(user => {
        const fullName = `${user.firstname} ${user.lastname}`;
        this.userNames.set(user.email, fullName);

        //get image for each user
        this.userService.getPhoto(user.email).subscribe(url=>{
          this.emailImageUrls.set(user.email, url);
      })

      })
    })
    this.subscriptions.add(sub)

    //get posts from backend
    this.getPosts();
    this.posts$ = this.postService.getPosts(this.category.value, this.tag.value);
    const sub2 = this.posts$.subscribe(posts => {
      posts.forEach(post => {
        const url = this.utilityService.getUrlFromText(post.content);
        if (url) {
          this.linkPreviewData[post.id] = this.postService.getLinkPreview(url);
        }
      });
    });
    this.subscriptions.add(sub2)
  }

  

  getTags(tagString: string){
    return tagString.split(',');
  }


  getUserFirstLastName(email: string){
    return this.userNames.get(email) || 'Loading...';
  }

  getPosts(): void {
    if(this.watchlistBtn && this.followBtn){
      const sub3 = this.userService.getFollowing(this.currentUser.email).subscribe(followers => {
        const sub4 = this.watchlistService.getWatchlistSymbols(this.currentUser.email).subscribe(symbols => {
          this.posts$ = this.postService.getPosts(this.category.value, this.tag.value, followers, symbols);
        })
        this.subscriptions.add(sub4);
      })
      this.subscriptions.add(sub3);
    } else if(this.watchlistBtn){
      const sub5 = this.watchlistService.getWatchlistSymbols(this.currentUser.email).subscribe(symbols => {
        this.posts$ = this.postService.getPosts(this.category.value, this.tag.value, undefined, symbols);
      })
      this.subscriptions.add(sub5);
    } else if(this.followBtn){
      const sub6 = this.userService.getFollowing(this.currentUser.email).subscribe(followers => {
        this.posts$ = this.postService.getPosts(this.category.value, this.tag.value, followers);
      })
      this.subscriptions.add(sub6);
    } else {
      this.posts$ = this.postService.getPosts(this.category.value, this.tag.value);
    }
  }

  onFilterChange():void{
    this.getPosts();
  }

  openDialog(): void{
    this.dialog.open(PostCreateDialogComponent, {
      width: '70%',
      height: '70%',
      data: { authorEmail: this.currentUser.email, content: '', tag: '', timestamp:''}
    });
  }

  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');

    this.subscriptions.unsubscribe();
  }
}
