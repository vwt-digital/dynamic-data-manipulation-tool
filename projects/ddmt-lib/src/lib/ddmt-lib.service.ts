import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { convertAPISpec } from './utils/apispec.helper';
import { map, switchMap } from 'rxjs/operators';
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
  setApiSpec(apiUrl: string, entityName: string): void {
    this.apiSpec = this.http.get(`${apiUrl}/openapi.json`).pipe(
      map(apiSpec => convertAPISpec(apiSpec, entityName))
    );
  }

  retrieveAllData(apiUrl: string, token: string): Observable<any> {
    const x = this.apiSpec.pipe(switchMap(apiSpec => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      return this.http.get(`${apiUrl}${apiSpec.operations.generic_get_multiple.endpoint}`, { headers });
    }));
    x.subscribe(console.log);
    return x
  }
}
