
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdroleService } from 'src/app/services/cvdrole.service';

@Component({
  selector: 'app-cvduser-detail',
  templateUrl: './cvduser-detail.component.html',
  styleUrls: ['./cvduser-detail.component.css']
})
export class CvduserDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'User Detail';
 errorMessage = '';
 objCvduser: Cvduser | undefined;

constructor( private objCvdroleService: CvdroleService,private route: ActivatedRoute,
 private router: Router,
 private objCvduserService: CvduserService) { }


 getCvduser(id: number) {
 this.objCvduserService.getCvduser(id).subscribe({
  next: (data: Cvduser) => {
    this.objCvduser = data;
    this.getCvdrole(this.objCvduser.FCvdroleId);
  },

 error: err => this.errorMessage = err
 });
 }


 
        
   getCvdrole(id: number): void {
     this.objCvdroleService.getCvdrole(id)
       .subscribe({
         next: (data) => this.objCvduser.CvdroleName = data.Name,
         error: err => this.errorMessage = err
       });
   }


 onBack(): void {
 this.router.navigate(['/Cvdusers']);
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
    this.getCvduser(id);
   }
  );
 }
}

