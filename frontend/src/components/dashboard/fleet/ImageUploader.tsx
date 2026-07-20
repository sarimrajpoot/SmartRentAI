import { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  images?: string[];
  onUpload: (files: File[]) => Promise<void>;
  onRemove?: (index: number) => void;
  maxFiles?: number;
  loading?: boolean;
}

export default function ImageUploader({ 
  images = [], 
  onUpload, 
  onRemove,
  maxFiles = 5,
  loading = false 
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).slice(0, maxFiles - images.length);
      if (files.length > 0) {
        await onUpload(files);
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files).slice(0, maxFiles - images.length);
      if (files.length > 0) {
        await onUpload(files);
      }
    }
  };

  const getFullUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {images.length < maxFiles && (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
            ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:bg-slate-50"}
            ${loading ? "opacity-50 pointer-events-none" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
            onChange={handleChange}
          />
          <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
            {loading ? (
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            ) : (
              <UploadCloud className="w-10 h-10 text-slate-400" />
            )}
            <div className="space-y-1 text-sm text-slate-600">
              <p className="font-medium text-slate-900">
                Click to upload <span className="text-slate-500 font-normal">or drag and drop</span>
              </p>
              <p className="text-xs text-slate-500">SVG, PNG, JPG or WebP (max. 5MB)</p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
              {url ? (
                <img 
                  src={getFullUrl(url)} 
                  alt={`Vehicle ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="text-slate-300 w-8 h-8" />
                </div>
              )}
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-md text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <X size={16} />
                </button>
              )}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-900/80 backdrop-blur rounded text-[10px] font-medium text-white">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
