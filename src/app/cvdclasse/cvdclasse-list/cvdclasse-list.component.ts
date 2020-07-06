
import { Component, OnInit } from '@angular/core';
import { CvdclasseService } from 'src/app/services/cvdclasse.service';
import { Cvdclasse } from 'src/app/models/cvdclasse';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdlevelService } from 'src/app/services/cvdlevel.service';
import { Cvdlevel } from 'src/app/models/cvdlevel';

@Component({
   selector: 'app-classe-list',
   templateUrl: './cvdclasse-list.component.html',
   styleUrls: ['./cvdclasse-list.component.css']
})
export class CvdclasseListComponent implements OnInit {
   isUserLoggedin: boolean;
   LoggedinUserName: string;
   constructor(private objCvdlevelService: CvdlevelService, private objCvdclasseService: CvdclasseService, private router: Router) { }
   ngOnInit() {
      if (!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
      this.getAllCvdlevel();
   }


   CvdlevelList: Cvdlevel[];
   getAllCvdlevel() {
      this.objCvdlevelService.getAllCvdlevel().subscribe({
         next: data => {
            this.CvdlevelList = data;
            this.getAllCvdclasse();
         },
         error: err => this.errorMessage = err
      });
   }

   getCvdlevelNameFromId(Id: Number): string {
      return this.CvdlevelList.find(r => r.id === Id).Name;
   }

   errorMessage: any;
   pageTitle: string = "Class List";
   _listFilter = '';
   get listFilter(): string {
      return this._listFilter;
   }
   set listFilter(value: string) {
      this._listFilter = value;
      this.filteredCvdclasses = this.listFilter ? this.performFilter(this.listFilter) : this.CvdclasseList;
   }

   filteredCvdclasses: Cvdclasse[] = [];
   CvdclasseList: Cvdclasse[] = [];

   performFilter(filterBy: string): Cvdclasse[] {
      filterBy = filterBy.toLocaleLowerCase();
      return this.CvdclasseList.filter((data: Cvdclasse) =>
         data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
   }

   getAllCvdclasse() {
      this.objCvdclasseService.getAllCvdclasse().subscribe({
         next: data => {
            this.CvdclasseList = data;
            this.CvdclasseList.forEach(r => r.CvdlevelName = this.getCvdlevelNameFromId(r.FCvdlevelId));
            this.filteredCvdclasses = this.CvdclasseList;
         },
         error: err => this.errorMessage = err
      });
   }
}

