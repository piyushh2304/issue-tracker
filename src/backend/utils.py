from __future__ import annotations

from typing import Iterable, List, Optional, Sequence, Tuple, TypeVar

T = TypeVar("T")


def paginate(items: Sequence[T], page: int, page_size: int) -> Tuple[List[T], int]:
    total = len(items)
    if page < 1:
        page = 1
    if page_size < 1:
        page_size = 10
    start = (page - 1) * page_size
    end = start + page_size
    return list(items[start:end]), total


def sort_items(items: Iterable[dict], sort_by: Optional[str], sort_dir: str) -> list:
    if not sort_by:
        return list(items)
    reverse = sort_dir.lower() == "desc"
    return sorted(items, key=lambda x: x.get(sort_by), reverse=reverse)


def ci_contains(haystack: Optional[str], needle: Optional[str]) -> bool:
    if haystack is None or needle is None:
        return False
    return needle.lower() in haystack.lower()
