import { Cvduser } from '../models/cvduser';

export class appconstants {
    public static url: string = "http://localhost:53931/api/";
    public static gblisUserLoggedin: boolean = false;
    public static gblLoggedinUserName: string;
    public static gblLoggedinUserId: number;
    public static gblLoggedinUserRole: number = 0;
  static gblobjCvduser: Cvduser;
    //public static gblobjCustomer: Cvduser;
}


