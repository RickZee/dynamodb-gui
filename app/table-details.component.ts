import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DynamoDbService } from './app.dynamodb.service';

@Component({
  moduleId: module.id,
  selector: 'table-detail',
  templateUrl: 'table-detail.component.html'
})
export class TableDetailsComponent implements OnInit {
  @Input() tableDetails: any;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private dynamoDbService: DynamoDbService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['name'] !== undefined) {
        let name = +params['name'];
        this.navigated = true;
        this.dynamoDbService.getTableItems(name)
          .then((tableDetails: any) => this.tableDetails = tableDetails);
      } else {
        this.navigated = false;
        this.tableDetails = {};
      }
    });
  }

  goBack(): void {
    this.close.emit();
    if (this.navigated) { window.history.back(); }
  }
}
