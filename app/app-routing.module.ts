import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableListComponent } from './table-list.component';
import { TableDetailsComponent } from './table-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: '/',
    component: TableListComponent
  },
  {
    path: 'detail/:name',
    component: TableDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [TableListComponent, TableDetailsComponent];
