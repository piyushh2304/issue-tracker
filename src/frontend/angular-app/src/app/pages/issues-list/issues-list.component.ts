import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Issue, IssueCreate, IssueUpdate } from '../../models/issue.model';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html'
})
export class IssuesListComponent implements OnInit {
  // Query state
  search = '';
  status = '';
  priority = '';
  assignee = '';
  sortBy: string = 'updatedAt';
  sortDir: 'asc' | 'desc' = 'desc';
  page = 1;
  pageSize = 10;

  // Data
  issues: Issue[] = [];
  total = 0;
  loading = false;

  // Modal state
  showForm = false;
  editId: number | null = null;
  form: IssueCreate | IssueUpdate = {
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assignee: ''
  };

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  get assigneeOptions(): string[] {
    const set = new Set<string>();
    this.issues.forEach(i => { if (i.assignee) set.add(i.assignee); });
    return Array.from(set).sort();
  }

  constructor(private api: IssueService, private router: Router) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.api.getIssues({
      search: this.search || undefined,
      status: this.status || undefined,
      priority: this.priority || undefined,
      assignee: this.assignee || undefined,
      sortBy: this.sortBy,
      sortDir: this.sortDir,
      page: this.page,
      pageSize: this.pageSize
    }).subscribe(res => {
      this.issues = res.items;
      this.total = res.total;
      this.loading = false;
    });
  }

  toggleSort(col: string) {
    if (this.sortBy === col) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = col;
      this.sortDir = 'asc';
    }
    this.fetch();
  }

  openCreate() {
    this.editId = null;
    this.form = { title: '', description: '', status: 'open', priority: 'medium', assignee: '' };
    this.showForm = true;
  }

  openEdit(issue: Issue) {
    this.editId = issue.id;
    this.form = { title: issue.title, description: issue.description || '', status: issue.status, priority: issue.priority, assignee: issue.assignee || '' };
    this.showForm = true;
  }

  submitForm() {
    if (!this.form.title || this.form.title.trim().length === 0) return;
    if (this.editId == null) {
      this.api.createIssue(this.form as IssueCreate).subscribe(() => {
        this.showForm = false;
        this.fetch();
      });
    } else {
      this.api.updateIssue(this.editId, this.form as IssueUpdate).subscribe(() => {
        this.showForm = false;
        this.fetch();
      });
    }
  }

  gotoDetail(issue: Issue) {
    this.router.navigate(['/issues', issue.id]);
  }
}
