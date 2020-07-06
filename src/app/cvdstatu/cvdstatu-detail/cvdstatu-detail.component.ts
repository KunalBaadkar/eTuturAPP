
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdstatuService } from 'src/app/services/cvdstatu.service';
import { Cvdstatu } from 'src/app/models/cvdstatu';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';

@Component({
  selector: 'app-cvdstatu-detail',
  templateUrl: './cvdstatu-detail.component.html',
  styleUrls: ['./cvdstatu-detail.component.css']
})
export class CvdstatuDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Status Detail';
 errorMessage = '';
 objCvdstatu: Cvdstatu | undefined;

constructor(private route: ActivatedRoute,
 private router: Router,
 private objCvdstatuService: CvdstatuService) { }


 getCvdstatu(id: number) {
 this.objCvdstatuService.getCvdstatu(id).subscribe({
 next: (data: Cvdstatu) => this.objCvdstatu = data,
 error: err => this.errorMessage = err
 });
 }

 onBack(): void {
 this.router.navigate(['/Cvdstatus']);
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
    this.getCvdstatu(id);
   }
  );
 }
}

