
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdcoursestatuService } from 'src/app/services/cvdcoursestatu.service';
import { Cvdcoursestatu } from 'src/app/models/cvdcoursestatu';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvduserService } from 'src/app/services/cvduser.service';
import { CvdstatuService } from 'src/app/services/cvdstatu.service';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';

@Component({
  selector: 'app-cvdcoursestatu-detail',
  templateUrl: './cvdcoursestatu-detail.component.html',
  styleUrls: ['./cvdcoursestatu-detail.component.css']
})
export class CvdcoursestatuDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Course Status Detail';
 errorMessage = '';
 objCvdcoursestatu: Cvdcoursestatu | undefined;

constructor(private objCvdcourseService: CvdcourseService,private objCvdstatuService: CvdstatuService,
  private objCvduserService: CvduserService,private route: ActivatedRoute,
 private router: Router,
 private objCvdcoursestatuService: CvdcoursestatuService) { }


 getCvdcoursestatu(id: number) {
 this.objCvdcoursestatuService.getCvdcoursestatu(id).subscribe({
  next: (data: Cvdcoursestatu) => {
    this.objCvdcoursestatu = data;
    this.getCvduser(this.objCvdcoursestatu.FCvduserId);
    this.getCvdstatu(this.objCvdcoursestatu.FCvdstatusId);
    this.getCvdcourse(this.objCvdcoursestatu.FCvdcourseId);
  },
 error: err => this.errorMessage = err
 });
 }

  getCvdcourse(id: number): void {
    this.objCvdcourseService.getCvdcourse(id)
      .subscribe({
        next: (data) => this.objCvdcoursestatu.CvdcourseName = data.Name,
        error: err => this.errorMessage = err
      });
  }


  getCvdstatu(id: number): void {
    this.objCvdstatuService.getCvdstatu(id)
      .subscribe({
        next: (data) => this.objCvdcoursestatu.CvdstatuName = data.Name,
        error: err => this.errorMessage = err
      });
  }



       

  getCvduser(id: number): void {
    this.objCvduserService.getCvduser(id)
      .subscribe({
        next: (data) => this.objCvdcoursestatu.CvduserName = data.Name,
        error: err => this.errorMessage = err
      });
  }

 

 onBack(): void {
 this.router.navigate(['/Cvdcoursestatus']);
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
    this.getCvdcoursestatu(id);
   }
  );
 }
}

