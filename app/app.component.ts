import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { DynamoDbService } from './app.dynamodb.service';

@Component({
    selector: 'main-app',
    templateUrl: 'app.entryComponents.html',
    providers: [DynamoDbService]
})
export class AppComponent implements OnInit {
    tables: any[];
    error: any;

    constructor(private dynamoDbService: DynamoDbService) { }

    ngOnInit(): void {
        this.getTables();
    }

    getTables(): void {
        this.dynamoDbService
            .getTables()
            .then(tables => this.tables = tables)
            .catch(error => this.error = error);
    }
}
