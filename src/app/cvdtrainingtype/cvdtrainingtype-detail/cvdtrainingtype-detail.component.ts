
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdtrainingtypeService } from 'src/app/services/cvdtrainingtype.service';
import { Cvdtrainingtype } from 'src/app/models/cvdtrainingtype';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';

@Component({
  selector: 'app-cvdtrainingtype-detail',
  templateUrl: './cvdtrainingtype-detail.component.html',
  styleUrls: ['./cvdtrainingtype-detail.component.css']
})
export class CvdtrainingtypeDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Training Type Detail';
 errorMessage = '';
 objCvdtrainingtype: Cvdtrainingtype | undefined;

constructor(private route: ActivatedRoute,
 private router: Router,
 private objCvdtrainingtypeService: CvdtrainingtypeService) { }


 getCvdtrainingtype(id: number) {
 this.objCvdtrainingtypeService.getCvdtrainingtype(id).subscribe({
 next: (data: Cvdtrainingtype) => this.objCvdtrainingtype = data,
 error: err => this.errorMessage = err
 });
 }

 onBack(): void {
 this.router.navigate(['/Cvdtrainingtypes']);
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
    this.getCvdtrainingtype(id);
   }
  );
 }
}

