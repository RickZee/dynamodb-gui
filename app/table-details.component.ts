import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DynamoDbService } from './app.dynamodb.service';

@Component({
  moduleId: module.id,
  selector: 'table-detail',
  templateUrl: 'table-details.component.html',
  providers: [DynamoDbService]
})
export class TableDetailsComponent implements OnInit {
  @Input() items: any[];
  @Input() table: any;
  @Output() close = new EventEmitter();
  error: any;
  tableName: string;
  hasItems: boolean;
  navigated = false; // true if navigated here

  constructor(
    private dynamoDbService: DynamoDbService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['name'] !== undefined) {
        this.tableName = params['name'];
        this.navigated = true;
        let table = { name: this.tableName };

        this.dynamoDbService.getTableDescription(table)
          .then((table: any) => {
            this.table = table;
            this.dynamoDbService.getTableItems(table.name)
              .then((items: any) => {
                this.items = items.Items;
                this.hasItems = this.items.length > 0;
              });
          });

      } else {
        this.navigated = false;
        this.items = [];
      }
    });
  }

  goBack(): void {
    this.close.emit();
    if (this.navigated) { window.history.back(); }
  }
}
