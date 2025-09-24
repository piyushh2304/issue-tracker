from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class StatusEnum(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"


class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class IssueBase(BaseModel):
    title: str = Field(min_length=1)
    description: Optional[str] = None
    status: StatusEnum = StatusEnum.open
    priority: PriorityEnum = PriorityEnum.medium
    assignee: Optional[str] = None


class IssueCreate(IssueBase):
    pass


class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None
    assignee: Optional[str] = None


class Issue(IssueBase):
    id: int
    createdAt: datetime
    updatedAt: datetime

    @staticmethod
    def now() -> datetime:
        return datetime.now(timezone.utc)
