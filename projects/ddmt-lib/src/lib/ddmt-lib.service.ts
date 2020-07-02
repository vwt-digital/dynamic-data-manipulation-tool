import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { convertAPISpec, capitalize } from './utils/apispec.helper';
import { map, shareReplay } from 'rxjs/operators';
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
      map(apiSpec => convertAPISpec(apiSpec, entityName)),
      shareReplay(1),
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

  /**
   * Updates a row when a change was detected.
   * @param apiUrl - The API url of the service.
   * @param token - The token to authenticate the request with.
   * @param entityName - The entity name to write the update into.
   * @param data - The new data to write into the datastore/firestore.
   */
  updateRow(apiUrl: string, token: string, entityName: string, data: any): void {
    const pluralEntityName = pluralize(entityName.toLowerCase(), 2);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.apiSpec.subscribe(apiSpec => {
      let idProp = capitalize(pluralize(entityName, 1));
      idProp = apiSpec.schemas[idProp]['x-db-table-id'];

      // The empty subscribe is required to trigger a post/put request in angular.
      this.http.put(
        `${apiUrl}/${pluralEntityName}/${data[idProp]}`,
        data,
        { headers, observe: 'response' }
      ).subscribe(res => {
        if (res.statusText !== 'OK') {
          throw new Error(res.statusText);
        }
      });
    });
  }
}
