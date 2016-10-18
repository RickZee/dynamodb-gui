
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DynamoDbService } from './app.dynamodb.service';

@Component({
    selector: 'table-list',
    templateUrl: 'app/table-list.component.html',
    providers: [DynamoDbService]
})
export class TableListComponent implements OnInit {
    tables: any[];
    error: any;
    columns: number = 3;

    constructor(
        private dynamoDbService: DynamoDbService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getTables();
    }

    getTables(): void {
        this.dynamoDbService
            .getTablesNames()
            .then(tables => { this.tables = tables; this.loadTableDescriptions(tables); })
            .then()
            .catch(error => this.error = error);
    }

    gotoDetail(table: any): void {
        let link = ['/table', table.name];
        this.router.navigate(link);
    }

    private loadTableDescriptions(tables: any[]): any[] {
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
