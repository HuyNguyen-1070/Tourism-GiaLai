import { useCallback, useState } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export const ImageUploader = ({ images, onChange, maxImages = 10 }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      if (images.length + files.length > maxImages) {
        alert(`Chỉ được tối đa ${maxImages} ảnh`);
        return;
      }
      setUploading(true);
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const mockUrl = URL.createObjectURL(files[i]);
        newUrls.push(mockUrl);
      }
      onChange([...images, ...newUrls]);
      setUploading(false);
    },
    [images, maxImages, onChange]
  );

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="aspect-square rounded-xl overflow-hidden border border-outline-variant/20 relative group shadow-sm"
          >
            <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
            {/* First image badge */}
            {idx === 0 && (
              <div className="absolute top-1.5 left-1.5">
                <span className="bg-forest-leaf/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Đại diện
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute inset-0 ring-2 ring-inset ring-transparent group-hover:ring-outline/20 transition-all rounded-xl pointer-events-none" />
          </div>
        ))}

        {images.length < maxImages && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 hover:border-forest-leaf hover:bg-forest-leaf/5 transition-all cursor-pointer group">
            {uploading ? (
              <Loader2 className="w-7 h-7 animate-spin text-forest-leaf" />
            ) : (
              <Upload className="w-7 h-7 text-outline group-hover:text-forest-leaf transition-colors" />
            )}
            <span className="text-[11px] font-medium text-outline group-hover:text-forest-leaf transition-colors">
              Tải ảnh lên
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-outline">
        <ImageIcon className="w-3.5 h-3.5" />
        <span>
          {images.length}/{maxImages} ảnh · Ảnh đầu tiên làm ảnh đại diện · PNG, JPG, WebP
        </span>
      </div>
    </div>
  );
};
