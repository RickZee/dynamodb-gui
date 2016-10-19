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
  items: any[];
  table: any;
  error: any;
  tableName: string;
  hasItems: boolean;
  navigated = false; // true if navigated here
  attributeNames: string[] = [];
  rows: any[] = [];

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
                let transformed = this.transformItems(this.items);
                this.rows = transformed.rows;
                this.attributeNames = transformed.attributeNames;
              });
          });

      } else {
        this.navigated = false;
        this.items = [];
      }
    });
  }

  goBack(): void {
    if (this.navigated) { window.history.back(); }
  }

  isObject(value: any): boolean {
    return typeof value === 'object'; 
  }

  private transformItems(items: any[]): any {
    let names: string[] = [];
    let rows: any[] = [];

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let row: any[] = [];

      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          let index = names.indexOf(key);

          if (index < 0) {
            names.push(key);
            index = names.length - 1;
          }

          let value = item[key];
          if (value) {
            for (let prop in value) {
              if (value.hasOwnProperty(prop)) {
                row[index] = value[prop];
                break;
              }
            }
          }
        }
      }

      rows.push(row);
    }

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      if (row.length < names.length) {
        row[names.length - 1] = undefined;
      }
    }

    return {
      attributeNames: names,
      rows: rows
    };
  }
}
