
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdlearncheckService } from 'src/app/services/cvdlearncheck.service';
import { Cvdlearncheck } from 'src/app/models/cvdlearncheck';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvduserService } from 'src/app/services/cvduser.service';
import { CvdquestionService } from 'src/app/services/cvdquestion.service';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';

@Component({
  selector: 'app-cvdlearncheck-detail',
  templateUrl: './cvdlearncheck-detail.component.html',
  styleUrls: ['./cvdlearncheck-detail.component.css']
})
export class CvdlearncheckDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Learn Check Detail';
 errorMessage = '';
 objCvdlearncheck: Cvdlearncheck | undefined;

constructor(private objCvdcourseService: CvdcourseService, private objCvdquestionService: CvdquestionService,private objCvduserService: CvduserService,private route: ActivatedRoute,
 private router: Router,
 private objCvdlearncheckService: CvdlearncheckService) { }

       
  getCvdcourse(id: number): void {
    this.objCvdcourseService.getCvdcourse(id)
      .subscribe({
        next: (data) => this.objCvdlearncheck.CvdcourseName = data.Name,
        error: err => this.errorMessage = err
      });
  }

 
        
 
   getCvdquestion(id: number): void {
     this.objCvdquestionService.getCvdquestion(id)
       .subscribe({
         next: (data) => this.objCvdlearncheck.CvdquestionName = data.Name,
         error: err => this.errorMessage = err
       });
   }
 
        
 
   getCvduser(id: number): void {
     this.objCvduserService.getCvduser(id)
       .subscribe({
         next: (data) => this.objCvdlearncheck.CvduserName = data.Name,
         error: err => this.errorMessage = err
       });
   }

 getCvdlearncheck(id: number) {
 this.objCvdlearncheckService.getCvdlearncheck(id).subscribe({
  next: (data: Cvdlearncheck) => {
    this.objCvdlearncheck = data;
    this.getCvduser(this.objCvdlearncheck.FCvduserId);
    this.getCvdquestion(this.objCvdlearncheck.FCvdquestionId);
    this.getCvdcourse(this.objCvdlearncheck.FCvdcourseId);
  },
 error: err => this.errorMessage = err
 });
 }

 onBack(): void {
 this.router.navigate(['/Cvdlearnchecks']);
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
    this.getCvdlearncheck(id);
   }
  );
 }
}

