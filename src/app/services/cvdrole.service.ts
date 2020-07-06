
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdrole } from '../models/cvdrole';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdroleService {

  constructor(private http: HttpClient) { }

 getAllCvdrole(): Observable<Cvdrole[]> {
 return this.http.get<Cvdrole[]>(appconstants.url + "Cvdroles")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdrole(id: number): Observable<Cvdrole> {
 if (id === 0) {
 return of(this.initializeCvdrole());
 }
 const url = appconstants.url + "Cvdroles/" + id;
 return this.http.get<Cvdrole>(url)
 .pipe(
 tap(data => console.log('getCvdrole: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdrole(objCvdrole: Cvdrole): Observable<Cvdrole> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdrole>(appconstants.url + "Cvdroles/", objCvdrole, { headers })
 .pipe(
 tap(data => console.log('createCvdrole: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdrole(objCvdrole: Cvdrole): Observable<Cvdrole> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdroles/" + objCvdrole.id;
 return this.http.put<Cvdrole>(url, objCvdrole, { headers })
 .pipe(
 tap(() => console.log('updateCvdrole: ' + objCvdrole.id)),
 map(() => objCvdrole),
 catchError(this.handleError)
 );
 }

 deleteCvdrole(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdroles/" + id;
 return this.http.delete<Cvdrole>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdrole: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdrole(): any {
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
