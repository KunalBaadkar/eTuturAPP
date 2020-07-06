
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdscreenService } from 'src/app/services/cvdscreen.service';
import { Cvdscreen } from 'src/app/models/cvdscreen';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';

@Component({
  selector: 'app-cvdscreen-detail',
  templateUrl: './cvdscreen-detail.component.html',
  styleUrls: ['./cvdscreen-detail.component.css']
})
export class CvdscreenDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Screen Detail';
 errorMessage = '';
 objCvdscreen: Cvdscreen | undefined;

constructor(private route: ActivatedRoute,
 private router: Router,
 private objCvdscreenService: CvdscreenService) { }


 getCvdscreen(id: number) {
 this.objCvdscreenService.getCvdscreen(id).subscribe({
 next: (data: Cvdscreen) => this.objCvdscreen = data,
 error: err => this.errorMessage = err
 });
 }

 onBack(): void {
 this.router.navigate(['/Cvdscreens']);
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
    this.getCvdscreen(id);
   }
  );
 }
}

