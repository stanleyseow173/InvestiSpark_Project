import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';
import { HomeComponent } from './components/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResearchComponent } from './components/research.component';
import { WatchlistComponent } from './components/watchlist.component';
import { UserProfileComponent } from './components/user-profile.component';
import { CommunityComponent } from './components/community.component';
import { ChecklistComponent } from './components/checklist.component';
import { SupportComponent } from './components/support.component';

const routes: Routes = [
  {path: '', canActivate:[AuthenticationGuard], children: [
    { path: '', component: HomeComponent },
    { path: 'research', component: ResearchComponent },
    { path: 'watchlist', component: WatchlistComponent },
    { path: 'user/:email', component: UserProfileComponent},
    { path: 'community', component: CommunityComponent},
    { path: 'checklist', component: ChecklistComponent}
  ],
  },{ path: 'login', component: LoginComponent },{ path: 'support', component: SupportComponent}, { path: 'about', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  ,
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }