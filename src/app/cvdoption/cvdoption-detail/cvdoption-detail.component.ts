
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdoptionService } from 'src/app/services/cvdoption.service';
import { Cvdoption } from 'src/app/models/cvdoption';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdquestionService } from 'src/app/services/cvdquestion.service';

@Component({
  selector: 'app-cvdoption-detail',
  templateUrl: './cvdoption-detail.component.html',
  styleUrls: ['./cvdoption-detail.component.css']
})
export class CvdoptionDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Option Detail';
 errorMessage = '';
 objCvdoption: Cvdoption | undefined;

constructor(private objCvdquestionService: CvdquestionService,private route: ActivatedRoute,
 private router: Router,
 private objCvdoptionService: CvdoptionService) { }


 getCvdoption(id: number) {
 this.objCvdoptionService.getCvdoption(id).subscribe({
  next: (data: Cvdoption) => {
    this.objCvdoption = data;
    this.getCvdquestion(this.objCvdoption.FCvdquestionId);
  },
 error: err => this.errorMessage = err
 });
 }


 
   getCvdquestion(id: number): void {
     this.objCvdquestionService.getCvdquestion(id)
       .subscribe({
         next: (data) => this.objCvdoption.CvdquestionName = data.Name,
         error: err => this.errorMessage = err
       });
   }

 onBack(): void {
 this.router.navigate(['/Cvdoptions']);
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
    this.getCvdoption(id);
   }
  );
 }
}

