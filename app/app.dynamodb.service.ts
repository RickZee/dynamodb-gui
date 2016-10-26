import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';
// import 'aws-sdk';

@Injectable()
export class DynamoDbService {
    private _apiUrl = 'http://localhost:8000';

    constructor(private http: Http) { }

    getTables(): Observable<any[]> {
        let query = {};

        return this.createRequest2(query, 'ListTables')
            .map((res: Response) => {
                let names = res.json().TableNames as string[];
                return names.map((name) => {
                    let table: any = { 'name': name };
                    this.getTableDescription(name)
                        .then(td => table.definition = td)
                        .catch(this.handleError);
                    return table;
                });
            })
            .catch(this.handleError);
    }

    getItems(tableName: string, searchTerm?: string): Observable<any[]> {
        console.debug('search term  =' + searchTerm);

        let query = { TableName: tableName };

        return this.createRequest2(query, 'Scan')
            .map(res => res.json() as any[]);
    }

    private createRequest2(body: any, action: string): Observable<Response> {
        let bodyString = JSON.stringify(body);

        let options = new RequestOptions({ headers: this.createHeaders(action) });

        return this.http.post(this._apiUrl, bodyString, options);
    }

    private getTableDescription(tableName: string): Promise<any> {
        let query = { TableName: tableName };
        return this.createRequest2(query, 'DescribeTable')
            .toPromise()
            .then(d => d.json().Table)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private createHeaders(action: string): Headers {
        let headers = new Headers();

        headers.append('Authorization',
            'AWS4-HMAC-SHA256 Credential=cUniqueSessionID/20161018/us-west-2/dynamodb/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date;x-amz-target;x-amz-user-agent, Signature=ec7a90f570d83862d638054c09cad1dc123b75f049744998f4b63b3c240c7813');
        headers.append('Content-Type', 'application/x-amz-json-1.0');
        headers.append('X-Amz-Content-Sha256', '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a');
        headers.append('X-Amz-Target', 'DynamoDB_20120810.' + action);
        headers.append('X-Amz-User-Agent', 'aws-sdk-js/2.2.4');

        return headers;
    }
}
