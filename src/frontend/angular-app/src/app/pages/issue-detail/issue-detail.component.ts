import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from '../../models/issue.model';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html'
})
export class IssueDetailComponent implements OnInit {
  issue?: Issue;
  loading = false;

  constructor(private route: ActivatedRoute, private router: Router, private api: IssueService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/']);
      return;
    }
    this.loading = true;
    this.api.getIssue(id).subscribe(i => { this.issue = i; this.loading = false; });
  }
}
