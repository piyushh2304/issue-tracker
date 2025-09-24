import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { IssuesListComponent } from './pages/issues-list/issues-list.component';
import { IssueDetailComponent } from './pages/issue-detail/issue-detail.component';

const routes: Routes = [
  { path: '', component: IssuesListComponent },
  { path: 'issues/:id', component: IssueDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AppComponent, IssuesListComponent, IssueDetailComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
