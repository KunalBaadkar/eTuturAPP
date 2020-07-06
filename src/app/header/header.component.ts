import { Component, OnInit, Input } from '@angular/core';
import { appconstants } from '../common/appconstants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() public isUserLoggedin: boolean;
  @Input() public LoggedinUserName: string;

  lclFProjroleId: number;
  constructor(private router:Router) { }
  
  ngOnInit() {
    if(this.isUserLoggedin==true)
    {
      this.lclFProjroleId = appconstants.gblLoggedinUserRole;
     // this.lclFProjroleId = appconstants.gblobjCustomer.FProjroleId;
    }
  }

  Logout()
  {
    appconstants.gblisUserLoggedin=false;
    this.isUserLoggedin= false;
    this.router.navigate(["/homes"]);
  }

  GoToLoginPage()
  {
    this.router.navigate(["/logins"]);
  }


}
