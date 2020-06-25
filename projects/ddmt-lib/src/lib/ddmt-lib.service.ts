import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { convertAPISpec } from './utils/apispec.helper';
import { map } from 'rxjs/operators';
import { APISpec } from './models/apiSpec.interface';
import * as pluralize from 'pluralize';

@Injectable({
  providedIn: 'root'
})
export class DDMTLibService {
  apiSpec: Observable<APISpec>;

  constructor(private http: HttpClient) { }

  /**
   * Sets the api spec for this service.
   * @param apiUrl - The API url of the service.
   */
  setApiSpec(apiUrl: string, entityName: string): void {
    this.apiSpec = this.http.get(`${apiUrl}/openapi.json`).pipe(
      map(apiSpec => convertAPISpec(apiSpec, entityName))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retrieveAllData(apiUrl: string, token: string, entityName: string): Observable<any> {
    const pluralEntityName = pluralize(entityName.toLowerCase(), 2);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${apiUrl}/${pluralEntityName}`, { headers })
      .pipe(map(res => res[pluralEntityName]));
  }
}
