import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, shareReplay } from 'rxjs/operators';
import pluralize from 'pluralize';

import { convertAPISpec, capitalize } from './utils/apispec.helper';
import { APISpec } from './models/apiSpec.interface';

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
  setApiSpec(apiUrl: string, entityName: string): Observable<APISpec> {
    this.apiSpec = this.http.get(`${apiUrl}/openapi.json`).pipe(
      map(apiSpec => convertAPISpec(apiSpec, entityName)),
      shareReplay(1),
    );

    return this.apiSpec;
  }

  /**
   * Retrieves data from an entity, if a url is provided it will request that page.
   * @param apiUrl - The API url of the service.
   * @param token - The token to authenticate the request with.
   * @param entityName - The entity name to write the update into.
   * @param url - An optional URL to provide if you want to go to the next/previous page.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retrieveData(apiUrl: string, token: string, entityName: string, gridName: string, url?: string): Observable<any> {
    const pluralEntityName = pluralize(entityName.toLowerCase(), 2);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Go to specified URL or use the default one.
    let URL = url;
    if (!url) {
      const chunkSize = JSON.parse(localStorage.getItem(`${gridName}-GRID-CHUNK-SIZE`));
      URL = `${apiUrl}/${pluralEntityName}?page_size=${ chunkSize ? chunkSize : 30}`;
    }

    return this.http.get(URL, { headers });
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
      ).subscribe(
        () => null,
        (err) => this.handleError(err)
      );
    });
  }

  /**
   * Handles HTTP errors.
   * @param err - A http error which needs to be shown in a notification to the user.
   */
  handleError(err: HttpErrorResponse): void {
    if (err.status === 401) {
      alert('You are unauthorized.');
    }

    if (err.status === 403) {
      alert('You do not seem to have the required permissions to perform this action.');
    }
  }

  /**
   * Updates a row when a change was detected.
   * @param apiUrl - The API url of the service.
   * @param token - The token to authenticate the request with.
   * @param entityName - The entity name to write the update into.
   * @param data - The new data to write into the datastore/firestore.
   */
  createRow(apiUrl: string, token: string, entityName: string, data: any): void {
    const pluralEntityName = pluralize(entityName.toLowerCase(), 2);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // The empty subscribe is required to trigger a post/put request in angular.
    this.http.post(
      `${apiUrl}/${pluralEntityName}`,
      data,
      { headers, observe: 'response' }
    ).subscribe(
      () => null,
      (err) => this.handleError(err)
    );
  }
}
