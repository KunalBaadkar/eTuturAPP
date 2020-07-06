
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdusersubscription } from '../models/cvdusersubscription';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdusersubscriptionService {

  constructor(private http: HttpClient) { }

 getAllCvdusersubscription(): Observable<Cvdusersubscription[]> {
 return this.http.get<Cvdusersubscription[]>(appconstants.url + "Cvdusersubscriptions")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdusersubscription(id: number): Observable<Cvdusersubscription> {
 if (id === 0) {
 return of(this.initializeCvdusersubscription());
 }
 const url = appconstants.url + "Cvdusersubscriptions/" + id;
 return this.http.get<Cvdusersubscription>(url)
 .pipe(
 tap(data => console.log('getCvdusersubscription: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdusersubscription(objCvdusersubscription: Cvdusersubscription): Observable<Cvdusersubscription> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdusersubscription>(appconstants.url + "Cvdusersubscriptions/", objCvdusersubscription, { headers })
 .pipe(
 tap(data => console.log('createCvdusersubscription: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdusersubscription(objCvdusersubscription: Cvdusersubscription): Observable<Cvdusersubscription> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdusersubscriptions/" + objCvdusersubscription.id;
 return this.http.put<Cvdusersubscription>(url, objCvdusersubscription, { headers })
 .pipe(
 tap(() => console.log('updateCvdusersubscription: ' + objCvdusersubscription.id)),
 map(() => objCvdusersubscription),
 catchError(this.handleError)
 );
 }

 deleteCvdusersubscription(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdusersubscriptions/" + id;
 return this.http.delete<Cvdusersubscription>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdusersubscription: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdusersubscription(): any {
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
