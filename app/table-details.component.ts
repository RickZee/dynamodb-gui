import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { DynamoDbService } from './app.dynamodb.service';

@Component({
  moduleId: module.id,
  selector: 'table-detail',
  templateUrl: 'table-details.component.html',
  providers: [DynamoDbService]
})
export class TableDetailsComponent implements OnInit {
  items: Observable<any[]> = Observable.of<any[]>([]);
  filteredItems: Observable<any[]> = Observable.of<any[]>([]);
  table: any;
  error: any;
  tableName: string = 'events';
  hasItems: boolean;
  navigated = false; // true if navigated here0
  attributeNames: Observable<string[]> = Observable.of<string[]>([]);
  rows: Observable<any[]> = Observable.of<any[]>([]);
  viewType: string = 'view-panel';

  private searchTerms: Subject<string> = new Subject<string>();

  constructor(
    private dynamoDbService: DynamoDbService,
    private route: ActivatedRoute) {
  }

  search(term: string): void {
    // Push a search term into the observable stream.
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['name'] !== undefined) {
        this.tableName = params['name'];
        this.navigated = true;

        this.items = this.dynamoDbService.getItems(this.tableName).catch(error => {
          // TODO: real error handling
          console.log(error);
          return Observable.of<any[]>([]);
        });

        let contains = function (term: string, value: any) {
          return ('' + value).toLowerCase().indexOf(('' + term).toLowerCase());
        };

        this.filteredItems = this.searchTerms
          .debounceTime(300)
          .distinctUntilChanged()
          .switchMap(term => this.items.filter(item => this.dynamoDbService.searchObject(term, item, contains)))
          .catch(error => {
            // TODO: real error handling
            console.log(error);
            return Observable.of<any[]>([]);
          });

        this.filteredItems.subscribe(items => {
          let transformed = this.transformItems(items);
          this.rows = Observable.of<any[]>(transformed.rows);
          this.attributeNames = Observable.of<any[]>(transformed.attributeNames);
        });

        this.searchTerms.next('');
      }
    });
  }

  changeViewType(evt: any): any {
    if (evt) {
      this.viewType = evt.value;
    }
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
