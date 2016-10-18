import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';
// import 'aws-sdk';

@Injectable()
export class DynamoDbService {
    private _apiUrl = 'http://localhost:8000';

    private _tables: any[] = [
        { 'name': 'table1', 'itemCount': '10' },
        { 'name': 'table2', 'itemCount': '5' },
        { 'name': 'table3', 'itemCount': '7' },
        { 'name': 'table4', 'itemCount': '90' },
        { 'name': 'table5', 'itemCount': '1' }
    ];

    constructor(private http: Http) { }

    getTablesNames(): Promise<any[]> {
        // console.debug('Getting list of tables');

        return this.createRequest({}, 'ListTables')
            .toPromise()
            .then((res) => {
                let names = res.TableNames as string[];
                return names.map((n) => {return {'name': n}; } );
            })
            .catch(this.handleError);
    }

    getTableDescription(table: any): Promise<any[]> {
        console.debug('Getting description of table ' + table.name);

        return this.createRequest({TableName: table.name}, 'DescribeTable')
            .toPromise()
            .then((res) => {
                table.definition = res;
                return table;
            })
            .catch(this.handleError);
    }
    
    getTableItems(tableName: string): Promise<any[]> {
        console.debug('Getting items for table ' + tableName);

        return this.createRequest({TableName: tableName}, 'Scan')
            .toPromise()
            .then(res => res)
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

    private createRequest(body: any, action: string): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers();
        headers.append('Authorization', 'AWS4-HMAC-SHA256 Credential=cUniqueSessionID/20161018/us-west-2/dynamodb/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date;x-amz-target;x-amz-user-agent, Signature=ec7a90f570d83862d638054c09cad1dc123b75f049744998f4b63b3c240c7813');
        headers.append('Content-Type', 'application/x-amz-json-1.0');
        headers.append('X-Amz-Content-Sha256', '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a');
        headers.append('X-Amz-Target', 'DynamoDB_20120810.' + action);
        headers.append('X-Amz-User-Agent', 'aws-sdk-js/2.2.4');

        let options = new RequestOptions({ headers: headers });

        return this.http.post(this._apiUrl, bodyString, options)
            .map((res: Response) => {console.log(res.json()); return res.json(); })
            .catch(this.handleError);
    }
}
