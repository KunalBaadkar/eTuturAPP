
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvddiscussionService } from 'src/app/services/cvddiscussion.service';
import { Cvddiscussion } from 'src/app/models/cvddiscussion';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { CvduserService } from 'src/app/services/cvduser.service';

@Component({
  selector: 'app-cvddiscussion-detail',
  templateUrl: './cvddiscussion-detail.component.html',
  styleUrls: ['./cvddiscussion-detail.component.css']
})
export class CvddiscussionDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Discussion Detail';
 errorMessage = '';
 objCvddiscussion: Cvddiscussion | undefined;

constructor(private objCvduserService: CvduserService,private objCvdcourseService: CvdcourseService,private route: ActivatedRoute,
 private router: Router,
 private objCvddiscussionService: CvddiscussionService) { }


 getCvddiscussion(id: number) {
 this.objCvddiscussionService.getCvddiscussion(id).subscribe({
  next: (data: Cvddiscussion) => {
    this.objCvddiscussion = data;
    this.getCvdcourse(this.objCvddiscussion.FCvdcourseId);
    this.getCvduser(this.objCvddiscussion.FCvduserId);
  },
 error: err => this.errorMessage = err
 });
 }



       

  getCvduser(id: number): void {
    this.objCvduserService.getCvduser(id)
      .subscribe({
        next: (data) => this.objCvddiscussion.CvduserName = data.Name,
        error: err => this.errorMessage = err
      });
  }
 
 
        
 
   getCvdcourse(id: number): void {
     this.objCvdcourseService.getCvdcourse(id)
       .subscribe({
         next: (data) => this.objCvddiscussion.CvdcourseName = data.Name,
         error: err => this.errorMessage = err
       });
   }

 onBack(): void {
 this.router.navigate(['/Cvddiscussions']);
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
    this.getCvddiscussion(id);
   }
  );
 }
}

