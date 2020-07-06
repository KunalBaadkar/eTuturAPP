import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { CvdroleDetailComponent } from './cvdrole/cvdrole-detail/cvdrole-detail.component';
import { CvdroleEditComponent } from './cvdrole/cvdrole-edit/cvdrole-edit.component';
import { CvdroleListComponent } from './cvdrole/cvdrole-list/cvdrole-list.component';
import { CvdscreenEditComponent } from './cvdscreen/cvdscreen-edit/cvdscreen-edit.component';
import { CvdscreenDetailComponent } from './cvdscreen/cvdscreen-detail/cvdscreen-detail.component';
import { CvdscreenListComponent } from './cvdscreen/cvdscreen-list/cvdscreen-list.component';
import { CvdclasseEditComponent } from './cvdclasse/cvdclasse-edit/cvdclasse-edit.component';
import { CvdclasseDetailComponent } from './cvdclasse/cvdclasse-detail/cvdclasse-detail.component';
import { CvdclasseListComponent } from './cvdclasse/cvdclasse-list/cvdclasse-list.component';
import { CvdcourseEditComponent } from './cvdcourse/cvdcourse-edit/cvdcourse-edit.component';
import { CvdcourseListComponent } from './cvdcourse/cvdcourse-list/cvdcourse-list.component';
import { CvdcourseDetailComponent } from './cvdcourse/cvdcourse-detail/cvdcourse-detail.component';
import { CvddiscussionListComponent } from './cvddiscussion/cvddiscussion-list/cvddiscussion-list.component';
import { CvddiscussionDetailComponent } from './cvddiscussion/cvddiscussion-detail/cvddiscussion-detail.component';
import { CvddiscussionEditComponent } from './cvddiscussion/cvddiscussion-edit/cvddiscussion-edit.component';
import { CvdfaqListComponent } from './cvdfaq/cvdfaq-list/cvdfaq-list.component';
import { CvdfaqDetailComponent } from './cvdfaq/cvdfaq-detail/cvdfaq-detail.component';
import { CvdfaqEditComponent } from './cvdfaq/cvdfaq-edit/cvdfaq-edit.component';
import { CvdfeedbackListComponent } from './cvdfeedback/cvdfeedback-list/cvdfeedback-list.component';
import { CvdfeedbackDetailComponent } from './cvdfeedback/cvdfeedback-detail/cvdfeedback-detail.component';
import { CvdfeedbackEditComponent } from './cvdfeedback/cvdfeedback-edit/cvdfeedback-edit.component';
import { CvdlearncheckListComponent } from './cvdlearncheck/cvdlearncheck-list/cvdlearncheck-list.component';
import { CvdlearncheckDetailComponent } from './cvdlearncheck/cvdlearncheck-detail/cvdlearncheck-detail.component';
import { CvdlearncheckEditComponent } from './cvdlearncheck/cvdlearncheck-edit/cvdlearncheck-edit.component';
import { CvdlevelListComponent } from './cvdlevel/cvdlevel-list/cvdlevel-list.component';
import { CvdlevelDetailComponent } from './cvdlevel/cvdlevel-detail/cvdlevel-detail.component';
import { CvdlevelEditComponent } from './cvdlevel/cvdlevel-edit/cvdlevel-edit.component';
import { CvdoptionListComponent } from './cvdoption/cvdoption-list/cvdoption-list.component';
import { CvdoptionDetailComponent } from './cvdoption/cvdoption-detail/cvdoption-detail.component';
import { CvdoptionEditComponent } from './cvdoption/cvdoption-edit/cvdoption-edit.component';
import { CvdpermissionListComponent } from './cvdpermission/cvdpermission-list/cvdpermission-list.component';
import { CvdpermissionDetailComponent } from './cvdpermission/cvdpermission-detail/cvdpermission-detail.component';
import { CvdpermissionEditComponent } from './cvdpermission/cvdpermission-edit/cvdpermission-edit.component';
import { CvdquestionListComponent } from './cvdquestion/cvdquestion-list/cvdquestion-list.component';
import { CvdquestionDetailComponent } from './cvdquestion/cvdquestion-detail/cvdquestion-detail.component';
import { CvdquestionEditComponent } from './cvdquestion/cvdquestion-edit/cvdquestion-edit.component';
import { CvdstatuListComponent } from './cvdstatu/cvdstatu-list/cvdstatu-list.component';
import { CvdstatuDetailComponent } from './cvdstatu/cvdstatu-detail/cvdstatu-detail.component';
import { CvdstatuEditComponent } from './cvdstatu/cvdstatu-edit/cvdstatu-edit.component';
import { CvdsubscriptionListComponent } from './cvdsubscription/cvdsubscription-list/cvdsubscription-list.component';
import { CvdsubscriptionDetailComponent } from './cvdsubscription/cvdsubscription-detail/cvdsubscription-detail.component';
import { CvdsubscriptionEditComponent } from './cvdsubscription/cvdsubscription-edit/cvdsubscription-edit.component';
import { CvdtableofcontentListComponent } from './cvdtableofcontent/cvdtableofcontent-list/cvdtableofcontent-list.component';
import { CvdtableofcontentDetailComponent } from './cvdtableofcontent/cvdtableofcontent-detail/cvdtableofcontent-detail.component';
import { CvdtableofcontentEditComponent } from './cvdtableofcontent/cvdtableofcontent-edit/cvdtableofcontent-edit.component';
import { CvdtrainingtypeListComponent } from './cvdtrainingtype/cvdtrainingtype-list/cvdtrainingtype-list.component';
import { CvdtrainingtypeDetailComponent } from './cvdtrainingtype/cvdtrainingtype-detail/cvdtrainingtype-detail.component';
import { CvdtrainingtypeEditComponent } from './cvdtrainingtype/cvdtrainingtype-edit/cvdtrainingtype-edit.component';
import { CvduserListComponent } from './cvduser/cvduser-list/cvduser-list.component';
import { CvduserDetailComponent } from './cvduser/cvduser-detail/cvduser-detail.component';
import { CvduserEditComponent } from './cvduser/cvduser-edit/cvduser-edit.component';
import { CvdusersubscriptionListComponent } from './cvdusersubscription/cvdusersubscription-list/cvdusersubscription-list.component';
import { CvdusersubscriptionDetailComponent } from './cvdusersubscription/cvdusersubscription-detail/cvdusersubscription-detail.component';
import { CvdusersubscriptionEditComponent } from './cvdusersubscription/cvdusersubscription-edit/cvdusersubscription-edit.component';
import { CvdcoursestatuListComponent } from './cvdcoursestatu/cvdcoursestatu-list/cvdcoursestatu-list.component';
import { CvdcoursestatuDetailComponent } from './cvdcoursestatu/cvdcoursestatu-detail/cvdcoursestatu-detail.component';
import { CvdcoursestatuEditComponent } from './cvdcoursestatu/cvdcoursestatu-edit/cvdcoursestatu-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    HeaderComponent,
    CvdroleDetailComponent,
    CvdroleEditComponent,
    CvdroleListComponent,
    CvdclasseListComponent,
    CvdclasseDetailComponent,
    CvdclasseEditComponent,
    CvdcourseListComponent,
    CvdcourseDetailComponent,
    CvdcourseEditComponent,
    CvdscreenListComponent,
    CvdscreenDetailComponent,
    CvdscreenEditComponent,
    CvddiscussionListComponent,
    CvddiscussionDetailComponent,
    CvddiscussionEditComponent,
    CvdfaqListComponent,
    CvdfaqDetailComponent,
    CvdfaqEditComponent,
    CvdfeedbackListComponent,
    CvdfeedbackDetailComponent,
    CvdfeedbackEditComponent,
    CvdlearncheckListComponent,
    CvdlearncheckDetailComponent,
    CvdlearncheckEditComponent,
    CvdlevelListComponent,
    CvdlevelDetailComponent,
    CvdlevelEditComponent,
    CvdoptionListComponent,
    CvdoptionDetailComponent,
    CvdoptionEditComponent,
    CvdpermissionListComponent,
    CvdpermissionDetailComponent,
    CvdpermissionEditComponent,
    CvdquestionListComponent,
    CvdquestionDetailComponent,
    CvdquestionEditComponent,
    CvdstatuListComponent,
    CvdstatuDetailComponent,
    CvdstatuEditComponent,
    CvdsubscriptionListComponent,
    CvdsubscriptionDetailComponent,
    CvdsubscriptionEditComponent,
    CvdtableofcontentListComponent,
    CvdtableofcontentDetailComponent,
    CvdtableofcontentEditComponent,
    CvdtrainingtypeListComponent,
    CvdtrainingtypeDetailComponent,
    CvdtrainingtypeEditComponent,
    CvduserListComponent,
    CvduserDetailComponent,
    CvduserEditComponent,
    CvdusersubscriptionListComponent,
    CvdusersubscriptionDetailComponent,
    CvdusersubscriptionEditComponent,
    CvdcoursestatuListComponent,
    CvdcoursestatuDetailComponent,
    CvdcoursestatuEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    HttpClientModule,
    RouterModule.forRoot([
       { path: 'Cvdusersubscriptions', component: CvdusersubscriptionListComponent },
       { path: 'Cvdusersubscriptions/:id', component: CvdusersubscriptionDetailComponent },
       {
       path: 'Cvdusersubscriptions/:id/edit',
       //canDeactivate: [CvdusersubscriptionEditGuard],
       component: CvdusersubscriptionEditComponent
       },
      { path: 'Cvdusers', component: CvduserListComponent },
       { path: 'Cvdusers/:id', component: CvduserDetailComponent },
       {
       path: 'Cvdusers/:id/edit',
       //canDeactivate: [CvduserEditGuard],
       component: CvduserEditComponent
       },
      { path: 'Cvdtrainingtypes', component: CvdtrainingtypeListComponent },
       { path: 'Cvdtrainingtypes/:id', component: CvdtrainingtypeDetailComponent },
       {
       path: 'Cvdtrainingtypes/:id/edit',
       //canDeactivate: [CvdtrainingtypeEditGuard],
       component: CvdtrainingtypeEditComponent
       },
      { path: 'Cvdtableofcontents', component: CvdtableofcontentListComponent },
       { path: 'Cvdtableofcontents/:id', component: CvdtableofcontentDetailComponent },
       {
       path: 'Cvdtableofcontents/:id/edit',
       //canDeactivate: [CvdtableofcontentEditGuard],
       component: CvdtableofcontentEditComponent
       },
      { path: 'Cvdsubscriptions', component: CvdsubscriptionListComponent },
       { path: 'Cvdsubscriptions/:id', component: CvdsubscriptionDetailComponent },
       {
       path: 'Cvdsubscriptions/:id/edit',
       //canDeactivate: [CvdsubscriptionEditGuard],
       component: CvdsubscriptionEditComponent
       },
      { path: 'Cvdstatus', component: CvdstatuListComponent },
       { path: 'Cvdstatus/:id', component: CvdstatuDetailComponent },
       {
       path: 'Cvdstatus/:id/edit',
       //canDeactivate: [CvdstatuEditGuard],
       component: CvdstatuEditComponent
       },
      { path: 'Cvdquestions', component: CvdquestionListComponent },
       { path: 'Cvdquestions/:id', component: CvdquestionDetailComponent },
       {
       path: 'Cvdquestions/:id/edit',
       //canDeactivate: [CvdquestionEditGuard],
       component: CvdquestionEditComponent
       },
      { path: 'Cvdpermissions', component: CvdpermissionListComponent },
       { path: 'Cvdpermissions/:id', component: CvdpermissionDetailComponent },
       {
       path: 'Cvdpermissions/:id/edit',
       //canDeactivate: [CvdpermissionEditGuard],
       component: CvdpermissionEditComponent
       },
 { path: 'Cvdoptions', component: CvdoptionListComponent },
 { path: 'Cvdoptions/:id', component: CvdoptionDetailComponent },
 {
 path: 'Cvdoptions/:id/edit',
 //canDeactivate: [CvdoptionEditGuard],
 component: CvdoptionEditComponent
 }, 
       { path: 'Cvdlevels', component: CvdlevelListComponent },
       { path: 'Cvdlevels/:id', component: CvdlevelDetailComponent },
       {
       path: 'Cvdlevels/:id/edit',
       //canDeactivate: [CvdlevelEditGuard],
       component: CvdlevelEditComponent
       },
       { path: 'Cvdlearnchecks', component: CvdlearncheckListComponent },
       { path: 'Cvdlearnchecks/:id', component: CvdlearncheckDetailComponent },
       {
       path: 'Cvdlearnchecks/:id/edit',
       //canDeactivate: [CvdlearncheckEditGuard],
       component: CvdlearncheckEditComponent
       },
       { path: 'Cvdfeedbacks', component: CvdfeedbackListComponent },
       { path: 'Cvdfeedbacks/:id', component: CvdfeedbackDetailComponent },
       {
       path: 'Cvdfeedbacks/:id/edit',
       //canDeactivate: [CvdfeedbackEditGuard],
       component: CvdfeedbackEditComponent
       },
       { path: 'Cvdfaqs', component: CvdfaqListComponent },
       { path: 'Cvdfaqs/:id', component: CvdfaqDetailComponent },
       {
       path: 'Cvdfaqs/:id/edit',
       //canDeactivate: [CvdfaqEditGuard],
       component: CvdfaqEditComponent
       },
       { path: 'Cvddiscussions', component: CvddiscussionListComponent },
       { path: 'Cvddiscussions/:id', component: CvddiscussionDetailComponent },
       {
       path: 'Cvddiscussions/:id/edit',
       //canDeactivate: [CvddiscussionEditGuard],
       component: CvddiscussionEditComponent
       },
        { path: 'Cvdcoursestatus', component: CvdcoursestatuListComponent },
        { path: 'Cvdcoursestatus/:id', component: CvdcoursestatuDetailComponent },
        {
        path: 'Cvdcoursestatus/:id/edit',
        //canDeactivate: [CvdcoursestatuEditGuard],
        component: CvdcoursestatuEditComponent
        },
       { path: 'Cvdcourses', component: CvdcourseListComponent },
       { path: 'Cvdcourses/:id', component: CvdcourseDetailComponent },
       {
       path: 'Cvdcourses/:id/edit',
       //canDeactivate: [CvdcourseEditGuard],
       component: CvdcourseEditComponent
       },
       { path: 'Cvdclasses', component: CvdclasseListComponent },
       { path: 'Cvdclasses/:id', component: CvdclasseDetailComponent },
       {
       path: 'Cvdclasses/:id/edit',
       //canDeactivate: [CvdclasseEditGuard],
       component: CvdclasseEditComponent
       },      
       { path: 'Cvdscreens', component: CvdscreenListComponent },
       { path: 'Cvdscreens/:id', component: CvdscreenDetailComponent },
       {
       path: 'Cvdscreens/:id/edit',
       //canDeactivate: [CvdscreenEditGuard],
       component: CvdscreenEditComponent
       },
      { path: 'Cvdroles', component: CvdroleListComponent },
      { path: 'Cvdroles/:id', component: CvdroleDetailComponent },
      {
        path: 'Cvdroles/:id/edit',
        //canDeactivate: [ProjroleEditGuard],
        component: CvdroleEditComponent
      },
      { path: 'logins', component: LoginComponent },
      { path: 'registers', component: RegisterComponent },
      { path: "forgotpasswords", component: ForgotPasswordComponent },
      { path: 'homes', component: HomeComponent },
      { path: '', redirectTo: 'homes', pathMatch: 'full' },
      { path: '**', redirectTo: 'homes', pathMatch: 'full' }

    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


