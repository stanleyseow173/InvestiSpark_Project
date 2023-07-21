import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './components/home.component';
import { RequestInterceptor } from './_helpers/request.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NouisliderModule } from 'ng2-nouislider';
import { AppService } from './app.service';
import { GoogleLoginProvider, SocialLoginModule, SocialAuthServiceConfig, 
  GoogleSigninButtonModule, SocialAuthService} from '@abacritt/angularx-social-login';
import { ResearchComponent } from './components/research.component';
import { StockService } from './_services/stock.service';
import { NgxSpinnerModule} from "ngx-spinner";
import { WatchlistComponent } from './components/watchlist.component';
import { AddToWatchlistDialogComponent } from './components/add-to-watchlist-dialog.component';
import { WatchlistService } from './_services/watchlist.service';
import { EmailService } from './_services/email.service';
import { NoteService } from './_services/note.service';
import { NgxChartsModule} from '@swimlane/ngx-charts';
import { SentimentService } from './_services/sentiment.service';
import { ComponentscustomSnackbarComponent } from './componentscustom-snackbar/componentscustom-snackbar.component';
import { ConfirmDialogComponent } from './utils/confirm-dialog/confirm-dialog.component';
import { UserProfileComponent } from './components/user-profile.component';
import { UserService } from './_services/user.service';
import { CommunityComponent } from './components/community.component';
import { PostService } from './_services/post.service';
import { PostCreateDialogComponent } from './components/post-create-dialog.component';
import { UtilityService } from './_services/utility.service';
import { ChecklistComponent } from './components/checklist.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChecklistService } from './_services/checklist.service';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './components/support.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    NavbarComponent,
    ResearchComponent,
    WatchlistComponent,
    AddToWatchlistDialogComponent,
    ComponentscustomSnackbarComponent,
    ConfirmDialogComponent,
    UserProfileComponent,
    CommunityComponent,
    PostCreateDialogComponent,
    ChecklistComponent,
    SupportComponent
    
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    NouisliderModule,
    ReactiveFormsModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    NgxSpinnerModule,
    NgxChartsModule,
    DragDropModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        //scope: 'email,public_profile',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('557553261890-f08ug0rlbufccminn8s8cfcgf49d525n.apps.googleusercontent.com'),
          }
        ],
        //fields: 'name,email,first_name,last_name',
        onError: (err) =>{
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    AppService, SocialAuthService, StockService, WatchlistService, EmailService, 
    NoteService, SentimentService, UserService, PostService, UtilityService, ChecklistService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
