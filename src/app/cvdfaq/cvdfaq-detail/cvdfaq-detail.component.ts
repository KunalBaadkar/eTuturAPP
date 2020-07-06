
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdfaqService } from 'src/app/services/cvdfaq.service';
import { Cvdfaq } from 'src/app/models/cvdfaq';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';

@Component({
  selector: 'app-cvdfaq-detail',
  templateUrl: './cvdfaq-detail.component.html',
  styleUrls: ['./cvdfaq-detail.component.css']
})
export class CvdfaqDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'FAQ Detail';
 errorMessage = '';
 objCvdfaq: Cvdfaq | undefined;

constructor(private route: ActivatedRoute,
 private router: Router,
 private objCvdfaqService: CvdfaqService) { }


 getCvdfaq(id: number) {
 this.objCvdfaqService.getCvdfaq(id).subscribe({
 next: (data: Cvdfaq) => this.objCvdfaq = data,
 error: err => this.errorMessage = err
 });
 }

 
 onBack(): void {
 this.router.navigate(['/Cvdfaqs']);
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
    this.getCvdfaq(id);
   }
  );
 }
}

