
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdlearncheck } from '../models/cvdlearncheck';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdlearncheckService {

  constructor(private http: HttpClient) { }

 getAllCvdlearncheck(): Observable<Cvdlearncheck[]> {
 return this.http.get<Cvdlearncheck[]>(appconstants.url + "Cvdlearnchecks")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdlearncheck(id: number): Observable<Cvdlearncheck> {
 if (id === 0) {
 return of(this.initializeCvdlearncheck());
 }
 const url = appconstants.url + "Cvdlearnchecks/" + id;
 return this.http.get<Cvdlearncheck>(url)
 .pipe(
 tap(data => console.log('getCvdlearncheck: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdlearncheck(objCvdlearncheck: Cvdlearncheck): Observable<Cvdlearncheck> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdlearncheck>(appconstants.url + "Cvdlearnchecks/", objCvdlearncheck, { headers })
 .pipe(
 tap(data => console.log('createCvdlearncheck: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdlearncheck(objCvdlearncheck: Cvdlearncheck): Observable<Cvdlearncheck> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdlearnchecks/" + objCvdlearncheck.id;
 return this.http.put<Cvdlearncheck>(url, objCvdlearncheck, { headers })
 .pipe(
 tap(() => console.log('updateCvdlearncheck: ' + objCvdlearncheck.id)),
 map(() => objCvdlearncheck),
 catchError(this.handleError)
 );
 }

 deleteCvdlearncheck(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdlearnchecks/" + id;
 return this.http.delete<Cvdlearncheck>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdlearncheck: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdlearncheck(): any {
 return {
 id: 0,
 Name: null
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
