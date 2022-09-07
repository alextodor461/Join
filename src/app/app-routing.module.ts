import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HelpComponent } from './help/help.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'forgot-password', component:  ForgotPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'board', component: BoardComponent},
  { path: 'add-task', component: AddTasksComponent},
  { path: 'contacts', component: ContactsComponent },
  { path: 'help', component: HelpComponent },
  { path: 'legal-notice', component: LegalNoticeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
