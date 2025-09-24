from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from models import Issue, IssueCreate, IssueUpdate, PriorityEnum, StatusEnum
from utils import paginate, sort_items, ci_contains

router = APIRouter()

# In-memory store
_issues: List[Issue] = []
_next_id: int = 1


def _seed_data() -> None:
    global _issues, _next_id
    if _issues:
        return
    now = datetime.now(timezone.utc)
    samples = [
        Issue(id=1, title="Login page error", description="500 on submit", status=StatusEnum.open, priority=PriorityEnum.high, assignee="Alice", createdAt=now, updatedAt=now),
        Issue(id=2, title="UI alignment", description="Navbar misaligned on mobile", status=StatusEnum.in_progress, priority=PriorityEnum.medium, assignee="Bob", createdAt=now, updatedAt=now),
        Issue(id=3, title="Payment failed", description="Stripe timeout intermittently", status=StatusEnum.open, priority=PriorityEnum.critical, assignee="Carol", createdAt=now, updatedAt=now),
        Issue(id=4, title="Typo on FAQ", description="Small typo in Q3", status=StatusEnum.resolved, priority=PriorityEnum.low, assignee="", createdAt=now, updatedAt=now),
    ]
    _issues.extend(samples)
    _next_id = 5


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/issues")
def list_issues(
    search: Optional[str] = Query(None, description="Search by title (contains)"),
    status: Optional[StatusEnum] = Query(None),
    priority: Optional[PriorityEnum] = Query(None),
    assignee: Optional[str] = Query(None),
    sortBy: Optional[str] = Query("updatedAt"),
    sortDir: str = Query("desc", pattern="^(?i)(asc|desc)$"),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=200),
):
    _seed_data()

    data = [i.model_dump() for i in _issues]

    # Filters
    if search:
        data = [d for d in data if ci_contains(d.get("title"), search)]
    if status is not None:
        data = [d for d in data if d.get("status") == status]
    if priority is not None:
        data = [d for d in data if d.get("priority") == priority]
    if assignee is not None and assignee != "":
        data = [d for d in data if ci_contains(d.get("assignee") or "", assignee)]

    # Sorting
    if sortBy not in {"id", "title", "status", "priority", "assignee", "updatedAt", "createdAt"}:
        sort_by = "updatedAt"
    else:
        sort_by = sortBy
    data = sort_items(data, sort_by, sortDir)

    # Pagination
    page_items, total = paginate(data, page, pageSize)

    return {"items": page_items, "total": total, "page": page, "pageSize": pageSize}


@router.get("/issues/{issue_id}")
def get_issue(issue_id: int):
    _seed_data()
    for issue in _issues:
        if issue.id == issue_id:
            return issue
    raise HTTPException(status_code=404, detail="Issue not found")


@router.post("/issues", status_code=201)
def create_issue(payload: IssueCreate):
    global _next_id
    now = datetime.now(timezone.utc)
    issue = Issue(
        id=_next_id,
        title=payload.title,
        description=payload.description,
        status=payload.status,
        priority=payload.priority,
        assignee=payload.assignee,
        createdAt=now,
        updatedAt=now,
    )
    _issues.append(issue)
    _next_id += 1
    return issue


@router.put("/issues/{issue_id}")
def update_issue(issue_id: int, payload: IssueUpdate):
    for idx, issue in enumerate(_issues):
        if issue.id == issue_id:
            data = issue.model_dump()
            upd = payload.model_dump(exclude_unset=True)
            data.update(upd)
            data["updatedAt"] = datetime.now(timezone.utc)
            _issues[idx] = Issue(**data)
            return _issues[idx]
    raise HTTPException(status_code=404, detail="Issue not found")
