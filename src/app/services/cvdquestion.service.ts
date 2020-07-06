
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdquestion } from '../models/cvdquestion';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdquestionService {

  constructor(private http: HttpClient) { }

 getAllCvdquestion(): Observable<Cvdquestion[]> {
 return this.http.get<Cvdquestion[]>(appconstants.url + "Cvdquestions")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdquestion(id: number): Observable<Cvdquestion> {
 if (id === 0) {
 return of(this.initializeCvdquestion());
 }
 const url = appconstants.url + "Cvdquestions/" + id;
 return this.http.get<Cvdquestion>(url)
 .pipe(
 tap(data => console.log('getCvdquestion: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdquestion(objCvdquestion: Cvdquestion): Observable<Cvdquestion> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdquestion>(appconstants.url + "Cvdquestions/", objCvdquestion, { headers })
 .pipe(
 tap(data => console.log('createCvdquestion: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdquestion(objCvdquestion: Cvdquestion): Observable<Cvdquestion> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdquestions/" + objCvdquestion.id;
 return this.http.put<Cvdquestion>(url, objCvdquestion, { headers })
 .pipe(
 tap(() => console.log('updateCvdquestion: ' + objCvdquestion.id)),
 map(() => objCvdquestion),
 catchError(this.handleError)
 );
 }

 deleteCvdquestion(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdquestions/" + id;
 return this.http.delete<Cvdquestion>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdquestion: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdquestion(): any {
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
