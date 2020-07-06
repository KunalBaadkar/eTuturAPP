
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdroleService } from 'src/app/services/cvdrole.service';
import { Cvdrole } from 'src/app/models/cvdrole';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';

@Component({
  selector: 'app-cvdrole-detail',
  templateUrl: './cvdrole-detail.component.html',
  styleUrls: ['./cvdrole-detail.component.css']
})
export class CvdroleDetailComponent implements OnDestroy, OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
 pageTitle: string = 'Role Detail';
 errorMessage = '';
 objCvdrole: Cvdrole | undefined;

constructor(private route: ActivatedRoute,
 private router: Router,
 private objCvdroleService: CvdroleService) { }


 getCvdrole(id: number) {
 this.objCvdroleService.getCvdrole(id).subscribe({
 next: (data: Cvdrole) => this.objCvdrole = data,
 error: err => this.errorMessage = err
 });
 }

 onBack(): void {
 this.router.navigate(['/Cvdroles']);
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
    this.getCvdrole(id);
   }
  );
 }
}

