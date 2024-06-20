import { Routes } from '@angular/router';
import { BoardComponent } from './features/board/pages/board/board.component';
import { AccountComponent } from './features/account/pages/account/account.component';
import { LoginComponent } from './features/login/pages/login/login.component';
import { SignUpComponent } from './features/sign-up/pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './features/reset-password/pages/reset-password/reset-password.component';
import { TutorialComponent } from './features/tutorial/pages/tutorial/tutorial.component';

export const routes: Routes = [
  {
    path: '',
    component: AccountComponent
  },
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent
  },
  {
    path: 'tutorial',
    component: TutorialComponent
  },
  {
    path: 'board',
    component: BoardComponent
  },
];
