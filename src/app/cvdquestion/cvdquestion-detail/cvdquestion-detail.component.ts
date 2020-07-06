
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdquestionService } from 'src/app/services/cvdquestion.service';
import { Cvdquestion } from 'src/app/models/cvdquestion';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';

@Component({
  selector: 'app-cvdquestion-detail',
  templateUrl: './cvdquestion-detail.component.html',
  styleUrls: ['./cvdquestion-detail.component.css']
})
export class CvdquestionDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Question Detail';
 errorMessage = '';
 objCvdquestion: Cvdquestion | undefined;

constructor(private objCvdcourseService: CvdcourseService,private route: ActivatedRoute,
 private router: Router,
 private objCvdquestionService: CvdquestionService) { }


 getCvdquestion(id: number) {
 this.objCvdquestionService.getCvdquestion(id).subscribe({
  next: (data: Cvdquestion) => {
    this.objCvdquestion = data;
    this.getCvdcourse(this.objCvdquestion.FCvdcourseId);
  },
 error: err => this.errorMessage = err
 });
 }


         
 
   getCvdcourse(id: number): void {
     this.objCvdcourseService.getCvdcourse(id)
       .subscribe({
         next: (data) => this.objCvdquestion.CvdcourseName = data.Name,
         error: err => this.errorMessage = err
       });
   }
 onBack(): void {
 this.router.navigate(['/Cvdquestions']);
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
    this.getCvdquestion(id);
   }
  );
 }
}

