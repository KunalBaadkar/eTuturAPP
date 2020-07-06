
import { Component, OnInit } from '@angular/core';
import { CvdusersubscriptionService } from 'src/app/services/cvdusersubscription.service';
import { Cvdusersubscription } from 'src/app/models/cvdusersubscription';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvduserService } from 'src/app/services/cvduser.service';
import { CvdsubscriptionService } from 'src/app/services/cvdsubscription.service';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvduser } from 'src/app/models/cvduser';
import { Cvdsubscription } from 'src/app/models/cvdsubscription';
import { Cvdcourse } from 'src/app/models/cvdcourse';

@Component({
   selector: 'app-cvdusersubscription-list',
   templateUrl: './cvdusersubscription-list.component.html',
   styleUrls: ['./cvdusersubscription-list.component.css']
})
export class CvdusersubscriptionListComponent implements OnInit {
   isUserLoggedin: boolean;
   LoggedinUserName: string;
   constructor(private objCvduserService: CvduserService, private objCvdsubscriptionService: CvdsubscriptionService, private objCvdcourseService: CvdcourseService, private objCvdusersubscriptionService: CvdusersubscriptionService, private router: Router) { }
   ngOnInit() {
      if (!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
      this.getAllCvdcourse();
   }
  
  CvduserList: Cvduser[];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
      next: data => {
        this.CvduserList = data;
        this.getAllCvdusersubscription();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvduserNameFromId(Id: Number): string {
    return this.CvduserList.find(r=>r.id===Id).Name;
  }

     CvdsubscriptionList: Cvdsubscription[];
     getAllCvdsubscription() {
       this.objCvdsubscriptionService.getAllCvdsubscription().subscribe({
         next: data => {
           this.CvdsubscriptionList = data;
           this.getAllCvduser();
         },
         error: err => this.errorMessage = err
       });
     }
   
     getCvdsubscriptionNameFromId(Id: Number): string {
       return this.CvdsubscriptionList.find(r=>r.id===Id).Name;
     }
     
     CvdcourseList: Cvdcourse[];
     getAllCvdcourse() {
       this.objCvdcourseService.getAllCvdcourse().subscribe({
         next: data => {
           this.CvdcourseList = data;
           this.getAllCvdsubscription();
         },
         error: err => this.errorMessage = err
       });
     }
   
     getCvdcourseNameFromId(Id: Number): string {
       return this.CvdcourseList.find(r=>r.id===Id).Name;
     }
   errorMessage: any;
   pageTitle: string = "User Subscription List";
   _listFilter = '';
   get listFilter(): string {
      return this._listFilter;
   }
   set listFilter(value: string) {
      this._listFilter = value;
      this.filteredCvdusersubscriptions = this.listFilter ? this.performFilter(this.listFilter) : this.CvdusersubscriptionList;
   }

   filteredCvdusersubscriptions: Cvdusersubscription[] = [];
   CvdusersubscriptionList: Cvdusersubscription[] = [];

   performFilter(filterBy: string): Cvdusersubscription[] {
      filterBy = filterBy.toLocaleLowerCase();
      return this.CvdusersubscriptionList.filter((data: Cvdusersubscription) =>
         data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
   }

   getAllCvdusersubscription() {
      this.objCvdusersubscriptionService.getAllCvdusersubscription().subscribe({
         next: data => {
            this.CvdusersubscriptionList = data;
            this.CvdusersubscriptionList.forEach(r=>r.CvdcourseName = this.getCvdcourseNameFromId(r.FCvdcourseId));
            this.CvdusersubscriptionList.forEach(r=>r.CvdsubscriptionName = this.getCvdsubscriptionNameFromId(r.FCvdsubscriptionId));
            this.CvdusersubscriptionList.forEach(r=>r.CvduserName = this.getCvduserNameFromId(r.FCvduserId));
         
            this.filteredCvdusersubscriptions = this.CvdusersubscriptionList;
         },
         error: err => this.errorMessage = err
      });
   }
}

