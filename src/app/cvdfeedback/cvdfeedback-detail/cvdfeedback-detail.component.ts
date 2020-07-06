
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdfeedbackService } from 'src/app/services/cvdfeedback.service';
import { Cvdfeedback } from 'src/app/models/cvdfeedback';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { CvduserService } from 'src/app/services/cvduser.service';

@Component({
  selector: 'app-cvdfeedback-detail',
  templateUrl: './cvdfeedback-detail.component.html',
  styleUrls: ['./cvdfeedback-detail.component.css']
})
export class CvdfeedbackDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Feedback Detail';
 errorMessage = '';
 objCvdfeedback: Cvdfeedback | undefined;

constructor(private objCvduserService: CvduserService, private objCvdcourseService: CvdcourseService,private route: ActivatedRoute,
 private router: Router,
 private objCvdfeedbackService: CvdfeedbackService) { }


 getCvdfeedback(id: number) {
 this.objCvdfeedbackService.getCvdfeedback(id).subscribe({
  next: (data: Cvdfeedback) => {
    this.objCvdfeedback = data;
    this.getCvdcourse(this.objCvdfeedback.FCvdcourseId);
    this.getCvduser(this.objCvdfeedback.FCvduserId);
  },
 error: err => this.errorMessage = err
 });
 }



  getCvduser(id: number): void {
    this.objCvduserService.getCvduser(id)
      .subscribe({
        next: (data) => this.objCvdfeedback.CvduserName = data.Name,
        error: err => this.errorMessage = err
      });
  }
 
        
 
   getCvdcourse(id: number): void {
     this.objCvdcourseService.getCvdcourse(id)
       .subscribe({
         next: (data) => this.objCvdfeedback.CvdcourseName = data.Name,
         error: err => this.errorMessage = err
       });
   }




 onBack(): void {
 this.router.navigate(['/Cvdfeedbacks']);
 }
ngOnInit() {
 if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;

 this.GetQueryStringParams();
 }

 private sub: Subscription;

 ngOnDestroy(): void {
  this.sub.unsubscribe();
 }

 GetQueryStringParams() {
  this.sub = this.route.paramMap.subscribe(
   params => {
    const id = +params.get('id');
    this.getCvdfeedback(id);
   }
  );
 }
}

