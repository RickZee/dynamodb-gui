import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { DynamoDbService } from './app.dynamodb.service';

@Component({
    selector: 'main-app',
    templateUrl: 'app/app.component.html',
    providers: [DynamoDbService]
})
export class AppComponent implements OnInit {
    tables: any[];
    error: any;
    columns: number = 3;

    constructor(private dynamoDbService: DynamoDbService) { }

    ngOnInit(): void {
        this.getTables();
    }

    getTables(): void {
        this.dynamoDbService
            .getTablesNames()
            .then(tables => {this.tables = tables; this.loadTableDescriptions(tables);})
            .then()
            .catch(error => this.error = error);
    }

    private loadTableDescriptions(tables: any[]) : any[] {
        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            this.dynamoDbService
                .getTableDescription(table)
                .then((t: any) => t.isLoaded = true)
                .catch(error => this.error = error);
        }
        return tables;
    } 
}
