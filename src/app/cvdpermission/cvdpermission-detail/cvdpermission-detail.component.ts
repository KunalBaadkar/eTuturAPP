
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdpermissionService } from 'src/app/services/cvdpermission.service';
import { Cvdpermission } from 'src/app/models/cvdpermission';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdroleService } from 'src/app/services/cvdrole.service';
import { CvduserService } from 'src/app/services/cvduser.service';

@Component({
  selector: 'app-cvdpermission-detail',
  templateUrl: './cvdpermission-detail.component.html',
  styleUrls: ['./cvdpermission-detail.component.css']
})
export class CvdpermissionDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Permission Detail';
 errorMessage = '';
 objCvdpermission: Cvdpermission | undefined;

constructor(private objCvduserService: CvduserService,private objCvdroleService: CvdroleService,private route: ActivatedRoute,
 private router: Router,
 private objCvdpermissionService: CvdpermissionService) { }


 getCvdpermission(id: number) {
 this.objCvdpermissionService.getCvdpermission(id).subscribe({
  next: (data: Cvdpermission) => {
    this.objCvdpermission = data;
    this.getCvdrole(this.objCvdpermission.FCvdroleId);
    this.getCvduser(this.objCvdpermission.FCvduserId);
  },
 error: err => this.errorMessage = err
 });
 }

   

  getCvduser(id: number): void {
    this.objCvduserService.getCvduser(id)
      .subscribe({
        next: (data) => this.objCvdpermission.CvduserName = data.Name,
        error: err => this.errorMessage = err
      });
  }
 
        
 
   getCvdrole(id: number): void {
     this.objCvdroleService.getCvdrole(id)
       .subscribe({
         next: (data) => this.objCvdpermission.CvdroleName = data.Name,
         error: err => this.errorMessage = err
       });
   }

 onBack(): void {
 this.router.navigate(['/Cvdpermissions']);
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
    this.getCvdpermission(id);
   }
  );
 }
}

