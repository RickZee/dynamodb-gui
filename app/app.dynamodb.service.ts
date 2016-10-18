import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';
// import 'aws-sdk';

@Injectable()
export class DynamoDbService {
    private _apiUrl = 'localhost/8000';

    private _tables: any[] = [
        { 'name': 'table1', 'itemCount': '10' },
        { 'name': 'table2', 'itemCount': '5' },
        { 'name': 'table3', 'itemCount': '7' },
        { 'name': 'table4', 'itemCount': '90' },
        { 'name': 'table5', 'itemCount': '1' }
    ];

    constructor(private http: Http) {
        this.initDynamoDb();
    }

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

    private initDynamoDb() {
        this.createRequest({}).subscribe(s=>console.log(s));
        // AWS.config.region = "us-east-1";
        // AWS.config.apiVersions = {
        //     dynamodb: '2012-08-10',
        // };

        // var dynamodb = new AWS.DynamoDB();
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private createRequest(body: any): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers();
        headers.append('Authorization', 'AWS4-HMAC-SHA256 Credential=cUniqueSessionID/20161018/us-west-2/dynamodb/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date;x-amz-target;x-amz-user-agent, Signature=ec7a90f570d83862d638054c09cad1dc123b75f049744998f4b63b3c240c7813');
        headers.append('Content-Type', 'application/x-amz-json-1.0');
        headers.append('X-Amz-Content-Sha256', '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a');
        headers.append('X-Amz-Target', 'DynamoDB_20120810.ListTables');
        headers.append('X-Amz-User-Agent', 'aws-sdk-js/2.2.4');

        let options = new RequestOptions({ headers: headers });

        return this.http.post(this._apiUrl, bodyString, options)
            .map((res: Response) => {console.log(res.json()); res.json()})
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

        // Authorization:AWS4-HMAC-SHA256 Credential=cUniqueSessionID/20161018/us-west-2/dynamodb/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date;x-amz-target;x-amz-user-agent, Signature=ec7a90f570d83862d638054c09cad1dc123b75f049744998f4b63b3c240c7813
        // Content-Type:application/x-amz-json-1.0
        // X-Amz-Content-Sha256:44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a
        // X-Amz-Target:DynamoDB_20120810.ListTables
        // X-Amz-User-Agent:aws-sdk-js/2.2.4


        // {
        //     "TableName": "Pets",
        //     "Key": {
        //         "AnimalType": {"S": "Dog"},
        //         "Name": {"S": "Fido"}
        //     }
        // }

    }
}
