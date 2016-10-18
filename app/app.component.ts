import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
        let link = ['/detail', table.name];
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
