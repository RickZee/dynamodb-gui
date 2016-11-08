import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DynamoDbService } from './app.dynamodb.service';

@Component({
    selector: 'table-list',
    templateUrl: 'app/table-list.component.html',
    providers: [DynamoDbService]
})
export class TableListComponent implements OnInit {
    tables: Observable<any[]> = Observable.of<any[]>([]);
    error: any;
    columns: number = 3;

    constructor(
        private dynamoDbService: DynamoDbService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getTables();
    }

    gotoDetail(table: any): void {
        let link = ['tables', table.name];
        this.router.navigate(link);
    }

    private getTables(): void {
        this.tables = this.dynamoDbService.getTables();
    }
}
