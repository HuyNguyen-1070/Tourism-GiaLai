import { useCallback, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

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
      // Mock upload - thay bằng API thực tế
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        // Giả lập upload lên Cloudinary
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
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="aspect-square rounded-lg overflow-hidden border border-outline/20 relative group"
          >
            <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-outline/20 flex flex-col items-center justify-center gap-2 hover:border-forest-leaf hover:bg-forest-leaf/5 transition-all cursor-pointer">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-forest-leaf" />
            ) : (
              <Upload className="w-8 h-8 text-outline" />
            )}
            <span className="text-label-sm text-outline">Tải ảnh</span>
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
      <p className="text-label-sm text-outline mt-2">
        Tối đa {maxImages} ảnh. Ảnh đầu tiên sẽ làm ảnh đại diện.
      </p>
    </div>
  );
};
