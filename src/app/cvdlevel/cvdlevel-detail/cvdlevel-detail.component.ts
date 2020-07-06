
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdlevelService } from 'src/app/services/cvdlevel.service';
import { Cvdlevel } from 'src/app/models/cvdlevel';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdtrainingtypeService } from 'src/app/services/cvdtrainingtype.service';

@Component({
  selector: 'app-cvdlevel-detail',
  templateUrl: './cvdlevel-detail.component.html',
  styleUrls: ['./cvdlevel-detail.component.css']
})
export class CvdlevelDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Level Detail';
 errorMessage = '';
 objCvdlevel: Cvdlevel | undefined;

constructor( private objCvdtrainingtypeService: CvdtrainingtypeService,private route: ActivatedRoute,
 private router: Router,
 private objCvdlevelService: CvdlevelService) { }


 getCvdlevel(id: number) {
 this.objCvdlevelService.getCvdlevel(id).subscribe({
 
  next: (data: Cvdlevel) => {
    this.objCvdlevel = data;
    this.getCvdtrainingtype(this.objCvdlevel.FCvdtrainingtypeId);
  },
 error: err => this.errorMessage = err
 });
 }

 
 
   getCvdtrainingtype(id: number): void {
     this.objCvdtrainingtypeService.getCvdtrainingtype(id)
       .subscribe({
         next: (data) => this.objCvdlevel.CvdtrainingtypeName = data.Name,
         error: err => this.errorMessage = err
       });
   }

 onBack(): void {
 this.router.navigate(['/Cvdlevels']);
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
    this.getCvdlevel(id);
   }
  );
 }
}

