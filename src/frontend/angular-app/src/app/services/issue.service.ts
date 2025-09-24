import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Issue, IssueCreate, IssueUpdate, PagedResult } from '../models/issue.model';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  getIssues(params: {
    search?: string;
    status?: string;
    priority?: string;
    assignee?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Observable<PagedResult<Issue>> {
    let p = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v));
    });
    return this.http.get<PagedResult<Issue>>(`${this.base}/issues`, { params: p });
  }

  getIssue(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.base}/issues/${id}`);
  }

  createIssue(payload: IssueCreate): Observable<Issue> {
    return this.http.post<Issue>(`${this.base}/issues`, payload);
  }

  updateIssue(id: number, payload: IssueUpdate): Observable<Issue> {
    return this.http.put<Issue>(`${this.base}/issues/${id}`, payload);
  }
}
