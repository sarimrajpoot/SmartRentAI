/**
 * Resolves a backend image path into a full absolute URL.
 * Handles missing slashes and accounts for the environment API base URL.
 */
export function getImageUrl(path?: string | null): string {
  // Graceful fallback for missing images
  if (!path) {
    return "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600";
  }

  // If it's already an absolute URL (e.g. from an external source or S3), return it directly
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Resolve base URL from environment or default to localhost for development
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Ensure there's exactly one slash between the base URL and the path
  const separator = path.startsWith("/") ? "" : "/";
  
  return `${baseUrl}${separator}${path}`;
}
