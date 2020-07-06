
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdsubscriptionService } from 'src/app/services/cvdsubscription.service';
import { Cvdsubscription } from 'src/app/models/cvdsubscription';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';

@Component({
  selector: 'app-cvdsubscription-detail',
  templateUrl: './cvdsubscription-detail.component.html',
  styleUrls: ['./cvdsubscription-detail.component.css']
})
export class CvdsubscriptionDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Subscription Detail';
 errorMessage = '';
 objCvdsubscription: Cvdsubscription | undefined;

constructor(private route: ActivatedRoute,
 private router: Router,
 private objCvdsubscriptionService: CvdsubscriptionService) { }


 getCvdsubscription(id: number) {
 this.objCvdsubscriptionService.getCvdsubscription(id).subscribe({
 next: (data: Cvdsubscription) => this.objCvdsubscription = data,
 error: err => this.errorMessage = err
 });
 }

 onBack(): void {
 this.router.navigate(['/Cvdsubscriptions']);
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
    this.getCvdsubscription(id);
   }
  );
 }
}

