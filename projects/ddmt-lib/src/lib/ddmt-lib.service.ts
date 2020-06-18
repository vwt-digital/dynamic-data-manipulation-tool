import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ColumnDefHelper } from './utils/columndefs.helper';

@Injectable({
  providedIn: 'root'
})
export class DDMTLibService {
  constructor(private http: HttpClient) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retrieveColumnDefs(apiUrl: string, entityName: string): Observable<any> {
    const apiSpec = this.http.get(`${apiUrl}/openapi.json`);
    return ColumnDefHelper.convertSpecToColDefs(apiSpec, entityName);
  }

  retrieveData(apiUrl: string, entityName: string): Observable<unknown> {
    return this.http.get(`${apiUrl}/${entityName}`)
  }
}
