export type Status = 'open' | 'in_progress' | 'resolved' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Issue {
  id: number;
  title: string;
  description?: string | null;
  status: Status;
  priority: Priority;
  assignee?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueCreate {
  title: string;
  description?: string | null;
  status: Status;
  priority: Priority;
  assignee?: string | null;
}

export interface IssueUpdate {
  title?: string;
  description?: string | null;
  status?: Status;
  priority?: Priority;
  assignee?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
