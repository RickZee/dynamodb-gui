import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class DynamoDbService {
    private _apiUrl = 'localhost/8000';

    private _tables: any[] = ['table1', 'table2', 'table3'];

    constructor(private http: Http) { }

    getTables(): Promise<any[]> {
        return Observable.from<any>(this._tables)
            .toPromise()
            .then(() => this._tables)
            .catch(this.handleError);
    }

    search(term: string): Observable<any[]> {
        return this.http
            .get(this._apiUrl + `list-tables`)
            .map((r: Response) => r.json().data as any[]);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
