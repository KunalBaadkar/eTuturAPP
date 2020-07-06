
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdtableofcontentService } from 'src/app/services/cvdtableofcontent.service';
import { Cvdtableofcontent } from 'src/app/models/cvdtableofcontent';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';

@Component({
  selector: 'app-cvdtableofcontent-detail',
  templateUrl: './cvdtableofcontent-detail.component.html',
  styleUrls: ['./cvdtableofcontent-detail.component.css']
})
export class CvdtableofcontentDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Table of Content Detail';
 errorMessage = '';
 objCvdtableofcontent: Cvdtableofcontent | undefined;

constructor(private objCvdcourseService: CvdcourseService,private route: ActivatedRoute,
 private router: Router,
 private objCvdtableofcontentService: CvdtableofcontentService) { }


 getCvdtableofcontent(id: number) {
 this.objCvdtableofcontentService.getCvdtableofcontent(id).subscribe({
 next: (data: Cvdtableofcontent) => {
  this.objCvdtableofcontent = data;
  this.getCvdcourse(this.objCvdtableofcontent.FCvdcourseId);
},
 error: err => this.errorMessage = err
 });
 }
 

  getCvdcourse(id: number): void {
    this.objCvdcourseService.getCvdcourse(id)
      .subscribe({
        next: (data) => this.objCvdtableofcontent.CvdcourseName = data.Name,
        error: err => this.errorMessage = err
      });
  }
 onBack(): void {
 this.router.navigate(['/Cvdtableofcontents']);
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
    this.getCvdtableofcontent(id);
   }
  );
 }
}

