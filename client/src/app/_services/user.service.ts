import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { User, UserFollower, UserStats } from 'app/models';
import { StorageService } from './storage.service';

const API_URL = '/api/test/';
const USERSTATS_URL = '/api/users';
const IMAGE_URL = '/api/photo';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private currentUserSubject = new BehaviorSubject<User>(null);
  currentUser = this.currentUserSubject.asObservable();
  
  //set up variables to store current user - which will be called by components to update
  constructor(
    private http: HttpClient,
    private storageService: StorageService
    ) {
      const user = this.storageService.getUser();
      if(user){
        this.currentUserSubject.next(user);
      }
    }

  //send a user-follower pair to backend to update follow
  followUser(userFollower: UserFollower): Observable<any> {
    return this.http.post('/api/users/followUser', userFollower);
  }

  //send a user-follower pair to backend to update unfollow
  unfollowUser(userFollower: UserFollower): Observable<any> {
    return this.http.post('/api/users/unfollowUser', userFollower);
  }

  //chcek if it is a user-follower pair
  isFollowing(userEmail: string, followerEmail: string): Observable<any> {
    return this.http.get(`/api/users/isFollowing?userEmail=${userEmail}&followerEmail=${followerEmail}`);
  }

  //Set user as current user
  setCurrentUser(user: User){
    this.currentUserSubject.next(user);
  }

  //get photo that's stored in database as user's icon - if not found - use default user icon 
  getPhoto(email: string):Observable<string>{
    const imageUrl = `${IMAGE_URL}/${email}`;
    return this.http.get(imageUrl,{responseType:'blob'}).pipe(
      map(()=>imageUrl),
      catchError(()=> of('./assets/img/user-icon.png')) //default user icon image
    )
  }

  //get all users from database
  getAllUsers():Observable<any>{
    return this.http.get<any>(`${USERSTATS_URL}/getAllUsers`);
  }

  //get list of users that are following a particular user
  getFollowing(userEmail: string): Observable<string[]>{
    return this.http.get<string[]>(`${USERSTATS_URL}/following?userEmail=${userEmail}`);
  }

  //get user stats from database
  getUserStats(email: string){
    return this.http.get<UserStats>(`${USERSTATS_URL}/${email}`)
  }

  //get user profile from data base
  getUserProfile(email: string){
    return this.http.get<User>(`${USERSTATS_URL}/profile/${email}`)
  }

  //create new user stats in database
  createNewUserStats(email: string){
    return this.http.get<UserStats>(`${USERSTATS_URL}/create/${email}`)
  }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }
  
  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }
}
