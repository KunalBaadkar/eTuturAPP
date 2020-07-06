
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdclasseService } from 'src/app/services/cvdclasse.service';

@Component({
  selector: 'app-cvdcourse-detail',
  templateUrl: './cvdcourse-detail.component.html',
  styleUrls: ['./cvdcourse-detail.component.css']
})
export class CvdcourseDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Course Detail';
 errorMessage = '';
 objCvdcourse: Cvdcourse | undefined;

constructor( private objCvdclasseService: CvdclasseService,private route: ActivatedRoute,
 private router: Router,
 private objCvdcourseService: CvdcourseService) { }

   getCvdclasse(id: number): void {
     this.objCvdclasseService.getCvdclasse(id)
       .subscribe({
         next: (data) => this.objCvdcourse.CvdclasseName = data.Name,
         error: err => this.errorMessage = err
       });
   }
 getCvdcourse(id: number) {
 this.objCvdcourseService.getCvdcourse(id).subscribe({
  next: (data: Cvdcourse) => {
    this.objCvdcourse = data;
    this.getCvdclasse(this.objCvdcourse.FCvdclassId);
  },
 error: err => this.errorMessage = err
 });
 }

 onBack(): void {
 this.router.navigate(['/Cvdcourses']);
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
    this.getCvdcourse(id);
   }
  );
 }
}

