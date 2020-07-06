import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvduser } from '../models/cvduser';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvduserService {

  constructor(private http: HttpClient) { }



  getAllCvduser(): Observable<Cvduser[]> {
    return this.http.get<Cvduser[]>(appconstants.url + "Cvdusers")
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getCvduser(id: number): Observable<Cvduser> {
    if (id === 0) {
      return of(this.initializeCvduser());
    }
    const url = appconstants.url + "Cvdusers/" + id;
    return this.http.get<Cvduser>(url)
      .pipe(
        tap(data => console.log('getCvduser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createCvduser(objCvduser: Cvduser): Observable<Cvduser> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Cvduser>(appconstants.url + "Cvdusers/", objCvduser, { headers })
      .pipe(
        tap(data => console.log('createCvduser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateCvduser(objCvduser: Cvduser): Observable<Cvduser> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = appconstants.url + "Cvdusers/" + objCvduser.id;
    return this.http.put<Cvduser>(url, objCvduser, { headers })
      .pipe(
        tap(() => console.log('updateCvduser: ' + objCvduser.id)),
        map(() => objCvduser),
        catchError(this.handleError)
      );
  }

  deleteCvduser(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = appconstants.url + "Cvdusers/" + id;
    return this.http.delete<Cvduser>(url, { headers })
      .pipe(
        tap(data => console.log('deleteCvduser: ' + id)),
        catchError(this.handleError)
      );
  }

  initializeCvduser(): any {
    return {
      id: 0,
      Name: null,
      EmailAddress: null,
      MobileNo: null,
      Password: null,
      FCvdroleId: 0
    };
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = "An error occurred:" + err.error.message;
    } else {
      errorMessage = "Backend returned code " + err.status + ":" + err.body.error;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
