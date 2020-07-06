
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvddiscussion } from '../models/cvddiscussion';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvddiscussionService {

  constructor(private http: HttpClient) { }

 getAllCvddiscussion(): Observable<Cvddiscussion[]> {
 return this.http.get<Cvddiscussion[]>(appconstants.url + "Cvddiscussions")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvddiscussion(id: number): Observable<Cvddiscussion> {
 if (id === 0) {
 return of(this.initializeCvddiscussion());
 }
 const url = appconstants.url + "Cvddiscussions/" + id;
 return this.http.get<Cvddiscussion>(url)
 .pipe(
 tap(data => console.log('getCvddiscussion: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvddiscussion(objCvddiscussion: Cvddiscussion): Observable<Cvddiscussion> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvddiscussion>(appconstants.url + "Cvddiscussions/", objCvddiscussion, { headers })
 .pipe(
 tap(data => console.log('createCvddiscussion: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvddiscussion(objCvddiscussion: Cvddiscussion): Observable<Cvddiscussion> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvddiscussions/" + objCvddiscussion.id;
 return this.http.put<Cvddiscussion>(url, objCvddiscussion, { headers })
 .pipe(
 tap(() => console.log('updateCvddiscussion: ' + objCvddiscussion.id)),
 map(() => objCvddiscussion),
 catchError(this.handleError)
 );
 }

 deleteCvddiscussion(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvddiscussions/" + id;
 return this.http.delete<Cvddiscussion>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvddiscussion: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvddiscussion(): any {
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
