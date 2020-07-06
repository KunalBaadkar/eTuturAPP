
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdfeedback } from '../models/cvdfeedback';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdfeedbackService {

  constructor(private http: HttpClient) { }

 getAllCvdfeedback(): Observable<Cvdfeedback[]> {
 return this.http.get<Cvdfeedback[]>(appconstants.url + "Cvdfeedbacks")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdfeedback(id: number): Observable<Cvdfeedback> {
 if (id === 0) {
 return of(this.initializeCvdfeedback());
 }
 const url = appconstants.url + "Cvdfeedbacks/" + id;
 return this.http.get<Cvdfeedback>(url)
 .pipe(
 tap(data => console.log('getCvdfeedback: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdfeedback(objCvdfeedback: Cvdfeedback): Observable<Cvdfeedback> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdfeedback>(appconstants.url + "Cvdfeedbacks/", objCvdfeedback, { headers })
 .pipe(
 tap(data => console.log('createCvdfeedback: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdfeedback(objCvdfeedback: Cvdfeedback): Observable<Cvdfeedback> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdfeedbacks/" + objCvdfeedback.id;
 return this.http.put<Cvdfeedback>(url, objCvdfeedback, { headers })
 .pipe(
 tap(() => console.log('updateCvdfeedback: ' + objCvdfeedback.id)),
 map(() => objCvdfeedback),
 catchError(this.handleError)
 );
 }

 deleteCvdfeedback(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdfeedbacks/" + id;
 return this.http.delete<Cvdfeedback>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdfeedback: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdfeedback(): any {
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
