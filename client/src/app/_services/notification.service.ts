// // import { Component, Inject, Injectable, OnInit, Optional } from "@angular/core";
// // //import { AngularFireMessaging } from "@angular/fire/compat/messaging";
// // import { BehaviorSubject } from "rxjs";
// // //import { getMessaging, getToken, isSupported, Messaging, onMessage } from "@angular/fire/messaging";
// // import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
// // import { EMPTY, from, Observable } from 'rxjs';
// // import { share, tap } from 'rxjs/operators';
// // import { environment } from "app/environments/environment";
// // import { FirebaseApp } from "@angular/fire/app";

// // @Injectable()
// @Component({
//     selector: 'app-messaging',
//     template: `
//       <p>
//         Messaging!
//         <code>{{ token$ | async | slice:0:12 }}<ng-container *ngIf="(token$ | async) !== null">&hellip;</ng-container></code>
//         &nbsp;<code>{{ message$ | async | json }}</code>
//         <button (click)="request()" *ngIf="showRequest">Request FCM token</button>
//       </p>
//     `,
//     styles: []
//   })
// export class NotificationComponent implements OnInit{

//     // currentMessage = new BehaviorSubject<any>(null);

//     // constructor(private angularFireMessaging: AngularFireMessaging){
//     // }

//     //messaging: any;
//     // messaging = async () => await isSupported() && getMessaging(getApp());

//     // private envVapidKey = environment.vapidKey

//     token$: Observable<any> = EMPTY;
//     message$: Observable<any> = EMPTY;
//     showRequest = false;

//     constructor(@Optional() messaging: Messaging, public firebaseApp: FirebaseApp) {
//       console.log('messaging', messaging);
//       if (messaging) {
//         this.token$ = from(
//           navigator.serviceWorker.register('firebase-messaging-sw.js', { type: 'module', scope: '__' }).
//             then(serviceWorkerRegistration =>
//               getToken(messaging, {
//                 serviceWorkerRegistration,
//                 vapidKey: environment.vapidKey,
//               })
//             )).pipe(
//               tap(token => console.log('FCM', {token})),
//               share(),
//             );
//         this.message$ = new Observable(sub => onMessage(messaging, it => sub.next(it))).pipe(
//           tap(token => console.log('FCM', {token})),
//         );
//       }
//     }
  
//     ngOnInit(): void {
//     }
  
//     request() {
//       Notification.requestPermission();
//     }

//     //app = initializeApp(environment.firebaseConfig)

//     // constructor(
//     //     private firebaseApp: FirebaseApp
//     // ){
//     //     const messaging =  async () => await isSupported() && getMessaging(initializeApp(environment.firebaseConfig));
//     //     this.initialiseMessaging(messaging);
//     // }

//     // private async initialiseMessaging(messaging){
//     //     //console.info("initialise Messsaging")
//     //     //const messaging = async () => await isSupported() && getMessaging();
//     //     //console.info("got to here");
//     //     //console.info(this.app)
//     //     //const token = await getToken(this.messaging, { vapidKey: this.envVapidKey });
//     //     this.requestPermission(messaging)
//     // }

//     // async requestPermission(messaging){
//     //     console.log('Requesting notifications permission....')
//     //     const permission = await Notification.requestPermission();
        
//     //     if(permission ==='granted'){
//     //             console.log('Notification permission granted');
//     //             await this.saveMessagingDeviceToken(messaging);
//     //     }else{
//     //         console.log("Unable to get permission to notify")
//     //     }
//     //     // this.angularFireMessaging.requestToken.subscribe({
//     //     //     next: (token)=>{
//     //     //         console.log('Permission granted! Save to the server!', token);
//     //     //     },
//     //     //     error: (error) =>{
//     //     //         console.error('Unable to get permission to notify', error);
//     //     //     }  
//     //     // })
//     // }
    
//     // async saveMessagingDeviceToken(messaging) {
//     //     console.info("entered savemessaging device")
//     //     //messaging = async () => await isSupported() && getMessaging(this.app);
//     //     try{
//     //         const msg = messaging()
//     //         console.info("after messaging")
//     //         const token = await getToken(msg, { vapidKey: this.envVapidKey})
//     //         //messaging = await isSupported() && getMessaging(this.app);
//     //         console.info("entering try")
//     //         if (token) {
//     //             console.log('Token: ', token);
//     //             // Send the token to your server and update the UI if necessary
//     //             // ...
//     //             onMessage(msg, (message) =>{
//     //                 console.log(
//     //                     'New foreground notification from Firebase Messaging',
//     //                     message.notification
//     //                 );
//     //                 new Notification(message.notification.title, {body: message.notification.body});
//     //             })
//     //         } else {
//     //             // Show permission request UI
//     //             console.log('No registration token available. Request permission to generate one.');
//     //             // ...
//     //             //this.requestPermission();
//     //         }   
//     //     } catch (err) {
//     //       console.log('An error occurred while retrieving token. ', err);
//     //       // ...
//     //     }
//     //   }

//     // receiveMessaging(){
//     //     this.angularFireMessaging.messages.subscribe((payload)=>{
//     //         console.log("new message received", payload)
//     //         this.currentMessage.next(payload)
//     //     })
//     // }
// }