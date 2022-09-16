import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SummaryComponent } from './summary/summary.component';
import { BoardComponent } from './board/board.component';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { ContactsComponent } from './contacts/contacts.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { HttpClientModule } from '@angular/common/http';
import { HotToastModule } from '@ngneat/hot-toast';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthenticationService } from 'src/services/authentication.service';
import { TaskService } from 'src/services/task.service';
import { UserService } from 'src/services/user.service';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogDeleteTaskComponent } from './dialog-delete-task/dialog-delete-task.component';
import { DialogSeeTaskDetailsComponent } from './dialog-see-task-details/dialog-see-task-details.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogEditTaskComponent } from './dialog-edit-task/dialog-edit-task.component';
import { DialogAddContactComponent } from './dialog-add-contact/dialog-add-contact.component';
import { DialogEditContactComponent } from './dialog-edit-contact/dialog-edit-contact.component';
import { DialogDeleteContactComponent } from './dialog-delete-contact/dialog-delete-contact.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    SummaryComponent,
    BoardComponent,
    AddTasksComponent,
    ContactsComponent,
    LegalNoticeComponent,
    DialogDeleteTaskComponent,
    DialogSeeTaskDetailsComponent,
    DialogEditTaskComponent,
    DialogAddContactComponent,
    DialogEditContactComponent,
    DialogDeleteContactComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HotToastModule.forRoot(),
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatStepperModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    DragDropModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  providers: [AuthGuard, AuthenticationService, UserService, TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
