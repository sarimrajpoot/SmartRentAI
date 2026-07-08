"""
Driver state management with a swappable backend.

The DriverStateManager provides a clean interface for storing and retrieving
DriverState objects keyed by session identifiers. The initial implementation
uses a thread-safe in-memory dictionary, suitable for single-process deployments.

To replace with a Redis-backed implementation, subclass BaseDriverStateManager
and reassign the module-level instance:

    # Example: swap to Redis without touching any AI pipeline code
    from app.ai.driver_monitor.state_manager import driver_state_manager  # noqa: F811
    driver_state_manager = RedisDriverStateManager(redis_url="redis://localhost:6379")

This module intentionally has no dependency on FastAPI, SQLAlchemy, or any
framework — it is a pure Python abstraction over a key-value store.
"""

from __future__ import annotations

import threading
from abc import ABC, abstractmethod

from app.ai.driver_monitor.state import DriverState


class BaseDriverStateManager(ABC):
    """
    Abstract base class defining the driver state storage interface.

    All implementations must provide the same two methods so that the AI
    pipeline and HTTP endpoints can call them without knowing which backend
    is in use.
    """

    @abstractmethod
    def get_or_create(self, session_id: str) -> DriverState:
        """
        Retrieve the DriverState for the given session ID.
        If no state exists for that ID, create and store a fresh DriverState.

        Args:
            session_id: A unique identifier for the driver monitoring session
                        (e.g. a UUID tied to a rental booking or a device ID).

        Returns:
            The DriverState associated with session_id.
        """
        ...

    @abstractmethod
    def clear(self, session_id: str) -> None:
        """
        Remove and discard the DriverState for the given session ID.
        Call this when a rental trip ends to free resources.

        Args:
            session_id: The session to remove.
        """
        ...


class InMemoryDriverStateManager(BaseDriverStateManager):
    """
    Thread-safe in-memory driver state manager.

    Uses a plain Python dict guarded by a threading.Lock.
    Suitable for single-process, single-worker deployments.

    Limitations:
        - State is lost on process restart.
        - Not suitable for multi-worker or multi-process deployments
          (e.g. gunicorn with multiple workers). Replace with a
          distributed backend such as RedisDriverStateManager in those cases.
    """

    def __init__(self) -> None:
        self._sessions: dict[str, DriverState] = {}
        self._lock = threading.Lock()

    def get_or_create(self, session_id: str) -> DriverState:
        with self._lock:
            if session_id not in self._sessions:
                self._sessions[session_id] = DriverState()
            return self._sessions[session_id]

    def clear(self, session_id: str) -> None:
        with self._lock:
            self._sessions.pop(session_id, None)


# ---------------------------------------------------------------------------
# Module-level singleton: the *manager* (not a single DriverState).
#
# This is the only object that needs to be replaced to swap the backend.
# The AI pipeline and HTTP endpoints always call driver_state_manager.*()
# and never instantiate DriverState directly.
# ---------------------------------------------------------------------------
driver_state_manager: BaseDriverStateManager = InMemoryDriverStateManager()
