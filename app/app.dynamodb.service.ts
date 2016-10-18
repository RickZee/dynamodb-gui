import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';

@Injectable()
export class DynamoDbService {
    private _apiUrl = 'localhost/8000';

    private _tables: any[] = [
        {'name': 'table1', 'itemCount': '10'},
        {'name': 'table2', 'itemCount': '5'},
        {'name': 'table3', 'itemCount': '7'},
        {'name': 'table4', 'itemCount': '90'},
        {'name': 'table5', 'itemCount': '1'}
    ];

    constructor(private http: Http) { }

    getTables(): Promise<any[]> {
        console.debug('Getting list of tables');
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
