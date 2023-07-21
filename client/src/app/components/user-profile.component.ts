import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UserFollower, UserStats } from 'app/models';
import { StorageService } from 'app/_services/storage.service';
import { UserService } from 'app/_services/user.service';
import { concatMap, Subscription } from 'rxjs';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy{

  currentUser: User;
  profileUser;
  userStats: UserStats;
  isUser: boolean;
  isFollowing;
  form: FormGroup;
  imageSrc: string;
  emailImageUrls = new Map<string, string>();

  private subscriptions: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private http: HttpClient, 
    private formBuilder: FormBuilder,
  ){}

  createUserStats(){
    const sub = this.userService.createNewUserStats(this.currentUser.email).subscribe(userStats=>{
      this.userStats = userStats;
    })
    this.subscriptions.add(sub)
  }

  toggleFollow(){
    this.isFollowing = !this.isFollowing;
    if(this.isFollowing) {
      const sub2 = this.userService.followUser(new UserFollower(this.currentUser.email, this.profileUser.email)).subscribe({
        next: res => {
          //console.log('Started following user');
        },
        error: error => {
          console.error('Error following user', error);
          this.isFollowing = !this.isFollowing; // revert the button status in case of error
        }
      }
      )
      this.subscriptions.add(sub2);
    } else {
      const sub3 = this.userService.unfollowUser(new UserFollower(this.currentUser.email, this.profileUser.email)).subscribe({
        next: res => {
          //console.log('Stopped following user');
        },
        error: error => {
          console.error('Error unfollowing user', error);
          this.isFollowing = !this.isFollowing; // revert the button status in case of error
        }
      })
      this.subscriptions.add(sub3);
    }
  }

  ngOnInit(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    const email = this.route.snapshot.paramMap.get('email');

    this.form = this.formBuilder.group({
      image: ['']
    });

    const sub4 = this.userService.currentUser.pipe(
      concatMap(user => {
        this.currentUser = this.storageService.getUser();
        return this.userService.isFollowing(this.currentUser.email, email);
      }),
      concatMap(isFollowing => {
        this.isFollowing = isFollowing;
        return this.userService.getUserProfile(email);
      }),
      concatMap(profileUser => {
        this.profileUser = profileUser;
        this.checkIfNotUser();
        return this.userService.getUserStats(email);
      }),
    ).subscribe(userStats => {
      this.userStats = userStats;
    })
    this.subscriptions.add(sub4);

    const sub5 = this.userService.getPhoto(email).subscribe(url =>{
      this.emailImageUrls.set(email,url);
    });
    this.subscriptions.add(sub5)

    
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.uploadFile(file);
    }
}
  //check if profile page is current user
  checkIfNotUser(){
    if (this.currentUser.email === this.profileUser.email){
      return false;
    }
    return true
  } 
  
  //uploade multipart file to backend
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('email', this.currentUser.email);
    const sub6 = this.http.post<any>('/api/photo', formData).subscribe({
      next: () => {
        const sub7 = this.userService.getPhoto(this.currentUser.email).subscribe(url =>{
          this.emailImageUrls.set(this.currentUser.email,url);
          location.reload();
        })
        this.subscriptions.add(sub7);
      },
      error: (err) => console.log(err)
    }
    )
    this.subscriptions.add(sub6);
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName('body')[0];
    if(body){
      body.classList.remove('landing-page');
    }
    
    var navbar = document.getElementsByTagName('nav')[0];
    if(navbar){
      navbar.classList.remove('navbar-transparent');
    }
    this.subscriptions.unsubscribe()
  }
}
