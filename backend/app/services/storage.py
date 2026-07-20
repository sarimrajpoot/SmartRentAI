import os
import uuid
from pathlib import Path
from typing import Protocol

class StorageService(Protocol):
    """Abstract protocol for file storage."""
    def save_file(self, content: bytes, original_filename: str, folder: str = "cars") -> str:
        """Saves a file and returns its public URL/path."""
        ...
    
    def delete_file(self, url: str) -> None:
        """Deletes a file given its URL/path."""
        ...


class LocalStorageService:
    """Local file system storage implementation."""
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    def save_file(self, content: bytes, original_filename: str, folder: str = "cars") -> str:
        folder_path = self.upload_dir / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        
        extension = Path(original_filename).suffix
        filename = f"{uuid.uuid4()}{extension}"
        destination = folder_path / filename
        
        destination.write_bytes(content)
        
        return f"/uploads/{folder}/{filename}"

    def delete_file(self, url: str) -> None:
        if url.startswith("/uploads/"):
            # Strip leading slash to get relative path
            relative_path = url[1:]
            file_path = Path(relative_path)
            if file_path.exists():
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Warning: Failed to delete local file {file_path}: {e}")

# Injectable dependency
def get_storage_service() -> StorageService:
    """Return the configured storage service (currently LocalStorageService)."""
    return LocalStorageService()
