
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdlevel } from '../models/cvdlevel';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdlevelService {

  constructor(private http: HttpClient) { }

 getAllCvdlevel(): Observable<Cvdlevel[]> {
 return this.http.get<Cvdlevel[]>(appconstants.url + "Cvdlevels")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdlevel(id: number): Observable<Cvdlevel> {
 if (id === 0) {
 return of(this.initializeCvdlevel());
 }
 const url = appconstants.url + "Cvdlevels/" + id;
 return this.http.get<Cvdlevel>(url)
 .pipe(
 tap(data => console.log('getCvdlevel: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdlevel(objCvdlevel: Cvdlevel): Observable<Cvdlevel> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdlevel>(appconstants.url + "Cvdlevels/", objCvdlevel, { headers })
 .pipe(
 tap(data => console.log('createCvdlevel: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdlevel(objCvdlevel: Cvdlevel): Observable<Cvdlevel> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdlevels/" + objCvdlevel.id;
 return this.http.put<Cvdlevel>(url, objCvdlevel, { headers })
 .pipe(
 tap(() => console.log('updateCvdlevel: ' + objCvdlevel.id)),
 map(() => objCvdlevel),
 catchError(this.handleError)
 );
 }

 deleteCvdlevel(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdlevels/" + id;
 return this.http.delete<Cvdlevel>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdlevel: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdlevel(): any {
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
