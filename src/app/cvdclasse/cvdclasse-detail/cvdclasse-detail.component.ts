
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdclasseService } from 'src/app/services/cvdclasse.service';
import { Cvdclasse } from 'src/app/models/cvdclasse';
import { Subscription } from 'rxjs';
import { appconstants } from 'src/app/common/appconstants';
import { CvdlevelService } from 'src/app/services/cvdlevel.service';

@Component({
  selector: 'app-classe-detail',
  templateUrl: './cvdclasse-detail.component.html',
  styleUrls: ['./cvdclasse-detail.component.css']
})
export class CvdclasseDetailComponent implements OnDestroy, OnInit {
  isUserLoggedin: boolean;
  LoggedinUserName: string;
  pageTitle: string = 'Class Detail';
  errorMessage = '';
  objCvdclasse: Cvdclasse | undefined;

  constructor(private objCvdlevelService: CvdlevelService, private route: ActivatedRoute,
    private router: Router,
    private objCvdclasseService: CvdclasseService) { }


  getCvdclasse(id: number) {
    this.objCvdclasseService.getCvdclasse(id).subscribe({
      next: (data: Cvdclasse) => {
        this.objCvdclasse = data;
        this.getCvdlevel(this.objCvdclasse.FCvdlevelId);
      },
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/Cvdclasses']);
  }
  ngOnInit() {
    if (!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;

    this.GetQueryStringParams();
  }


  getCvdlevel(id: number): void {
    this.objCvdlevelService.getCvdlevel(id)
      .subscribe({
        next: (data) => this.objCvdclasse.CvdlevelName = data.Name,
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
        this.getCvdclasse(id);
      }
    );
  }
}

