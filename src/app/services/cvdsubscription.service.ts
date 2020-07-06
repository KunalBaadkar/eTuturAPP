
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdsubscription } from '../models/cvdsubscription';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdsubscriptionService {

  constructor(private http: HttpClient) { }

 getAllCvdsubscription(): Observable<Cvdsubscription[]> {
 return this.http.get<Cvdsubscription[]>(appconstants.url + "Cvdsubscriptions")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdsubscription(id: number): Observable<Cvdsubscription> {
 if (id === 0) {
 return of(this.initializeCvdsubscription());
 }
 const url = appconstants.url + "Cvdsubscriptions/" + id;
 return this.http.get<Cvdsubscription>(url)
 .pipe(
 tap(data => console.log('getCvdsubscription: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdsubscription(objCvdsubscription: Cvdsubscription): Observable<Cvdsubscription> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdsubscription>(appconstants.url + "Cvdsubscriptions/", objCvdsubscription, { headers })
 .pipe(
 tap(data => console.log('createCvdsubscription: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdsubscription(objCvdsubscription: Cvdsubscription): Observable<Cvdsubscription> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdsubscriptions/" + objCvdsubscription.id;
 return this.http.put<Cvdsubscription>(url, objCvdsubscription, { headers })
 .pipe(
 tap(() => console.log('updateCvdsubscription: ' + objCvdsubscription.id)),
 map(() => objCvdsubscription),
 catchError(this.handleError)
 );
 }

 deleteCvdsubscription(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdsubscriptions/" + id;
 return this.http.delete<Cvdsubscription>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdsubscription: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdsubscription(): any {
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
