import { useCallback, useState } from 'react';
import { Upload, X, Loader2, ImageIcon, CheckCircle } from 'lucide-react';
import api from '@/services/axiosClient';

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

interface UploadApiResponse {
  code: number;
  data: { url: string };
}

export const ImageUploader = ({ images, onChange, maxImages = 10 }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [name: string]: 'uploading' | 'done' | 'error';
  }>({});

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
      const progress: { [name: string]: 'uploading' | 'done' | 'error' } = {};

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        progress[file.name] = 'uploading';
        setUploadProgress({ ...progress });

        try {
          const formData = new FormData();
          formData.append('file', file);

          const res = (await api.post('/images/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })) as unknown as UploadApiResponse;

          const url = res?.data?.url;
          if (url) {
            newUrls.push(url);
            progress[file.name] = 'done';
          } else {
            progress[file.name] = 'error';
          }
        } catch {
          progress[file.name] = 'error';
        }
        setUploadProgress({ ...progress });
      }

      onChange([...images, ...newUrls]);
      setUploading(false);
      // Clear progress after short delay
      setTimeout(() => setUploadProgress({}), 2000);
      // Reset input
      e.target.value = '';
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
      <div className="grid grid-cols-3 gap-2">
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
          <label
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group ${
              uploading
                ? 'border-forest-leaf/50 bg-forest-leaf/5 cursor-wait'
                : 'border-outline-variant/30 hover:border-forest-leaf hover:bg-forest-leaf/5'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-forest-leaf" />
                <span className="text-[10px] font-medium text-forest-leaf">Đang tải...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-outline group-hover:text-forest-leaf transition-colors" />
                <span className="text-[10px] font-medium text-outline group-hover:text-forest-leaf transition-colors text-center px-1">
                  Tải ảnh lên
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Upload progress indicators */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-1">
          {Object.entries(uploadProgress).map(([name, status]) => (
            <div key={name} className="flex items-center gap-2 text-xs">
              {status === 'uploading' && (
                <Loader2 className="w-3 h-3 animate-spin text-forest-leaf flex-shrink-0" />
              )}
              {status === 'done' && (
                <CheckCircle className="w-3 h-3 text-forest-leaf flex-shrink-0" />
              )}
              {status === 'error' && <X className="w-3 h-3 text-error flex-shrink-0" />}
              <span className={`truncate ${status === 'error' ? 'text-error' : 'text-outline'}`}>
                {name} {status === 'error' ? '(lỗi)' : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 text-xs text-outline leading-relaxed bg-white/50 p-2.5 rounded-lg border border-outline-variant/10">
        <ImageIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span className="flex-1">
          <strong>
            {images.length}/{maxImages} ảnh.
          </strong>{' '}
          Ảnh đầu tiên làm ảnh đại diện. Chỉ hỗ trợ PNG, JPG, WebP.
        </span>
      </div>
    </div>
  );
};
