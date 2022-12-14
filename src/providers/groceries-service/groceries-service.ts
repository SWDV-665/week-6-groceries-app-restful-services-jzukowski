import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';

/*
  Generated class for the GroceriesServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroceriesServiceProvider {

  items = [];
  baseURL = "http://localhost:8080";

  dataChanged$: Observable<boolean>;
  private dataChangeSubject: Subject<boolean>;

  constructor(public http: HttpClient) {
    console.log('Hello GroceriesServiceProvider Provider');

    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

  getItems(): Observable<object[]> {
    //return this.items;
    return this.http.get(this.baseURL + "/api/groceries").pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  removeItem(index) {
    this.http.delete(this.baseURL + "/api/groceries/" + index).subscribe(res => {
      this.items = <any>res;
      this.dataChangeSubject.next(true);
    });
  }

  addItem(data) {
    this.http.post(this.baseURL + "/api/groceries", data).subscribe(res => {
      this.items = <any>res;
      this.dataChangeSubject.next(true);
    });
  }

  editItem(data, index) {
    this.http.put(this.baseURL + "/api/groceries/" + index, data).subscribe(res => {
      this.items = <any>res;
      this.dataChangeSubject.next(true);
    });
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError (error: Response | any) {
    let errMsg : string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
