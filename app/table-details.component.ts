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
  itemCount: number = 0;
  filteredCount: number = 0;

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
    this.getItems();
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

  private getItems(): void {
    this.route.params.forEach((params: Params) => {
      if (params['name'] !== undefined) {
        this.tableName = params['name'];
        this.navigated = true;

        this.items = this.dynamoDbService.getItems(this.tableName);

        let contains = function (term: string, value: any) {
          return ('' + value).toLowerCase().indexOf(('' + term).toLowerCase()) >= 0;
        };

        this.items.subscribe(items => {
          this.itemCount = items.length;
        });

        let service = this.dynamoDbService;

        this.filteredItems = this.searchTerms
          .debounceTime(300)
          .distinctUntilChanged()
          .switchMap(term => {
            console.log(term);
            this.items.subscribe(items => {
              let filtered: any[] = items.filter(x => service.searchObject(term, x, contains));
              this.filteredCount = filtered.length;
                console.log('Filtering items ... ' + filtered.length);
              let transformed = this.transformItems(filtered);
              this.rows = Observable.of<any[]>(transformed.rows);
              this.attributeNames = Observable.of<any[]>(transformed.attributeNames);
            });
            return this.filteredItems;
          })
          .catch(error => {
            // TODO: real error handling
            console.log(error);
            return Observable.of<any[]>([]);
          });

        this.filteredItems.subscribe(items => {
        });

        this.searchTerms.next('');
      }
    });
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
