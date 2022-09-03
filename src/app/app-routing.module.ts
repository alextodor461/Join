import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'SignUp', component: SignUpComponent },
  { path: 'ForgotPassword', component:  ForgotPasswordComponent},
  { path: 'ResetPassword', component: ResetPasswordComponent },
  { path: 'Summary', component: SummaryComponent },
  { path: 'Board', component: BoardComponent},
  { path: 'AddTasks', component: AddTasksComponent},
  { path: 'Contacts', component: ContactsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
