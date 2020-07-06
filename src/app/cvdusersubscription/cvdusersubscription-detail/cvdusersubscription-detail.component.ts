
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdusersubscriptionService } from 'src/app/services/cvdusersubscription.service';
import { Cvdusersubscription } from 'src/app/models/cvdusersubscription';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { CvdsubscriptionService } from 'src/app/services/cvdsubscription.service';
import { CvduserService } from 'src/app/services/cvduser.service';

@Component({
  selector: 'app-cvdusersubscription-detail',
  templateUrl: './cvdusersubscription-detail.component.html',
  styleUrls: ['./cvdusersubscription-detail.component.css']
})
export class CvdusersubscriptionDetailComponent implements OnDestroy, OnInit {
  isUserLoggedin: boolean;
  LoggedinUserName: string;
  pageTitle: string = 'User Subscription Detail';
  errorMessage = '';
  objCvdusersubscription: Cvdusersubscription | undefined;

  constructor(private objCvduserService: CvduserService,
    private objCvdsubscriptionService: CvdsubscriptionService,
    private objCvdcourseService: CvdcourseService,
    private route: ActivatedRoute,
    private router: Router,
    private objCvdusersubscriptionService: CvdusersubscriptionService) { }


  getCvdusersubscription(id: number) {
    this.objCvdusersubscriptionService.getCvdusersubscription(id).subscribe({
      next: (data: Cvdusersubscription) => {
        this.objCvdusersubscription = data;
        this.getCvdcourse(this.objCvdusersubscription.FCvdcourseId);
        this.getCvdsubscription(this.objCvdusersubscription.FCvdsubscriptionId);
        this.getCvduser(this.objCvdusersubscription.FCvduserId);
      },
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/Cvdusersubscriptions']);
  }
  ngOnInit() {
    if (!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.GetQueryStringParams();
  }

  
    getCvduser(id: number): void {
      this.objCvduserService.getCvduser(id)
        .subscribe({
          next: (data) => this.objCvdusersubscription.CvduserName = data.Name,
          error: err => this.errorMessage = err
        });
    }

  getCvdsubscription(id: number): void {
    this.objCvdsubscriptionService.getCvdsubscription(id)
      .subscribe({
        next: (data) => this.objCvdusersubscription.CvdsubscriptionName = data.Name,
        error: err => this.errorMessage = err
      });
  }


  getCvdcourse(id: number): void {
    this.objCvdcourseService.getCvdcourse(id)
      .subscribe({
        next: (data) => this.objCvdusersubscription.CvdcourseName = data.Name,
        error: err => this.errorMessage = err
      });
  }

  private sub: Subscription;

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  GetQueryStringParams() {
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getCvdusersubscription(id);
      }
    );
  }
}

