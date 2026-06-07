import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RichTextEditor } from './RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tags, Globe, Send, Edit3, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/api/adminApi';

const postSchema = z
  .object({
    title: z.string().min(10, 'Tiêu đề tối thiểu 10 ký tự').max(255, 'Tiêu đề tối đa 255 ký tự'),
    content: z.string().refine((val) => stripHtml(val).trim().length >= 50, {
      message: 'Nội dung phải có ít nhất 50 ký tự (không tính HTML)',
    }),
    summary: z.string().max(500, 'Tóm tắt tối đa 500 ký tự').optional(),
    tags: z.array(z.string()).min(1, 'Chọn ít nhất 1 thẻ').max(5, 'Tối đa 5 thẻ'),
    images: z.array(z.string()).max(10, 'Tối đa 10 ảnh').optional(),
    sourceType: z.enum(['AUTHOR', 'EXTERNAL']),
    sourceName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.sourceType === 'EXTERNAL' && !data.sourceName) return false;
      return true;
    },
    { message: 'Vui lòng nhập tên nguồn khi chọn External', path: ['sourceName'] }
  );

type PostFormValues = z.infer<typeof postSchema>;

const stripHtml = (html: string) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const extractImageUrls = (html: string) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return Array.from(tmp.querySelectorAll('img'))
    .map((img) => img.src)
    .filter((src): src is string => Boolean(src));
};

const DEFAULT_TAGS: { value: string; label: string; emoji: string }[] = [
  { value: 'LOCATION', label: 'Địa điểm', emoji: '📍' },
  { value: 'CULTURE', label: 'Văn hóa', emoji: '🎭' },
  { value: 'HISTORY', label: 'Lịch sử', emoji: '📜' },
  { value: 'FESTIVAL', label: 'Lễ hội', emoji: '🎪' },
  { value: 'FOOD', label: 'Ẩm thực', emoji: '🍜' },
  { value: 'ACCOMMODATION', label: 'Lưu trú', emoji: '🏨' },
  { value: 'TRANSPORT', label: 'Di chuyển', emoji: '🚌' },
];

const LABEL_MAP: Record<string, string> = {
  LOCATION: 'Địa điểm',
  CULTURE: 'Văn hóa',
  HISTORY: 'Lịch sử',
  FESTIVAL: 'Lễ hội',
  FOOD: 'Ẩm thực',
  ACCOMMODATION: 'Lưu trú',
  TRANSPORT: 'Di chuyển',
};

const EMOJI_MAP: Record<string, string> = {
  LOCATION: '📍',
  CULTURE: '🎭',
  HISTORY: '📜',
  FESTIVAL: '🎪',
  FOOD: '🍜',
  ACCOMMODATION: '🏨',
  TRANSPORT: '🚌',
};

interface PostFormProps {
  defaultValues?: Partial<PostFormValues>;
  onSubmit: (data: PostFormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) => (
  <div className="flex items-start gap-3 mb-4">
    <div>
      <h3 className="font-semibold text-on-surface text-sm flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-forest-leaf" />
        {title}
      </h3>
      {description && <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>}
    </div>
  </div>
);

export const PostForm = ({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Gửi xét duyệt',
}: PostFormProps) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [availableTags, setAvailableTags] = useState<
    {
      value: string;
      label: string;
      emoji: string;
    }[]
  >(DEFAULT_TAGS);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      summary: '',
      tags: [],
      images: [],
      sourceType: 'AUTHOR',
      sourceName: '',
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data: PostFormValues) => {
    const extractedImages = extractImageUrls(data.content);
    const images =
      data.images && data.images.length > 0 ? data.images : extractedImages.slice(0, 10);
    await onSubmit({ ...data, images });
  };

  useEffect(() => {
    const loadTags = async () => {
      try {
        const res = await adminApi.getTags();
        const tags = res.data ?? [];

        if (tags.length > 0) {
          const mapped = tags.map((tag) => ({
            value: tag.name,
            label: LABEL_MAP[tag.name] || tag.name,
            emoji: EMOJI_MAP[tag.name] || '🏷️',
          }));
          if (mapped.length > 0) {
            setAvailableTags(mapped);
            return;
          }
        }
      } catch {
        // fallback to defaults
      }
      setAvailableTags(DEFAULT_TAGS);
    };

    loadTags();
  }, []);

  const sourceType = watch('sourceType');
  const selectedTags = watch('tags');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setValue(
        'tags',
        selectedTags.filter((t) => t !== tag)
      );
    } else {
      setValue('tags', [...selectedTags, tag]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8"
    >
      {/* LEFT COLUMN: Main Content */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-outline-variant/20 pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'write'
                ? 'border-forest-leaf text-forest-leaf'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'preview'
                ? 'border-forest-leaf text-forest-leaf'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        {activeTab === 'write' ? (
          <div className="space-y-5">
            {/* Title */}
            <div>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Tiêu đề bài viết..."
                    className="text-2xl font-bold h-auto py-3 border-none shadow-none focus-visible:ring-0 px-0 bg-transparent placeholder:text-outline-variant/60"
                  />
                )}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Summary */}
            <div>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={2}
                    placeholder="Tóm tắt nội dung (không bắt buộc)..."
                    className="resize-none border-none shadow-none bg-surface-container-low focus-visible:ring-1 focus-visible:ring-forest-leaf text-on-surface-variant text-sm py-3"
                  />
                )}
              />
              {errors.summary && (
                <p className="text-red-500 text-xs mt-1.5">{errors.summary.message}</p>
              )}
            </div>

            {/* Content TipTap */}
            <div>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1.5">{errors.content.message}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="prose prose-forest-leaf max-w-none bg-white p-6 rounded-lg border border-outline-variant/10 min-h-[400px]">
            {watch('title') ? (
              <h1 className="mb-4">{watch('title')}</h1>
            ) : (
              <h1 className="text-outline/50 mb-4 italic">Chưa có tiêu đề</h1>
            )}

            {watch('summary') && (
              <p className="text-xl text-on-surface-variant italic mb-8 border-l-4 border-forest-leaf/50 pl-4 py-1">
                {watch('summary')}
              </p>
            )}

            {watch('content') ? (
              <div dangerouslySetInnerHTML={{ __html: watch('content') }} />
            ) : (
              <p className="text-outline/50 italic">Chưa có nội dung bài viết...</p>
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Sidebar (Sticky) */}
      <div className="space-y-6 lg:sticky lg:top-6 self-start">
        {/* Tags */}
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20">
          <SectionHeader icon={Tags} title="Thẻ phân loại" description="Chọn 1-5 thẻ" />
          <div className="flex flex-wrap gap-2">
            {availableTags.map(({ value, label, emoji }) => (
              <button
                type="button"
                key={value}
                onClick={() => toggleTag(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all border ${
                  selectedTags.includes(value)
                    ? 'bg-forest-leaf text-white border-forest-leaf shadow-sm'
                    : 'bg-white border-outline-variant/30 text-on-surface-variant hover:border-forest-leaf/50 hover:text-forest-leaf'
                }`}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
          {errors.tags && <p className="text-red-500 text-xs mt-2">{errors.tags.message}</p>}
        </div>

        {/* Source */}
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20">
          <SectionHeader icon={Globe} title="Nguồn bài viết" />
          <div className="flex flex-col gap-2 mb-3">
            <Controller
              name="sourceType"
              control={control}
              render={({ field }) => (
                <>
                  <button
                    type="button"
                    onClick={() => field.onChange('AUTHOR')}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left ${
                      field.value === 'AUTHOR'
                        ? 'border-forest-leaf bg-forest-leaf/5'
                        : 'border-outline-variant/30 bg-white hover:border-forest-leaf/30'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${field.value === 'AUTHOR' ? 'border-forest-leaf bg-forest-leaf' : 'border-outline-variant/50'}`}
                    />
                    <p
                      className={`font-medium text-[13px] ${field.value === 'AUTHOR' ? 'text-forest-leaf' : 'text-on-surface-variant'}`}
                    >
                      Tác giả gốc (của tôi)
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange('EXTERNAL')}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left ${
                      field.value === 'EXTERNAL'
                        ? 'border-secondary bg-secondary/5'
                        : 'border-outline-variant/30 bg-white hover:border-secondary/30'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${field.value === 'EXTERNAL' ? 'border-secondary bg-secondary' : 'border-outline-variant/50'}`}
                    />
                    <p
                      className={`font-medium text-[13px] ${field.value === 'EXTERNAL' ? 'text-secondary' : 'text-on-surface-variant'}`}
                    >
                      Nguồn bên ngoài
                    </p>
                  </button>
                </>
              )}
            />
          </div>

          {sourceType === 'EXTERNAL' && (
            <div>
              <Controller
                name="sourceName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Tên nguồn (VD: Báo Gia Lai)"
                    className="text-sm h-9"
                  />
                )}
              />
              {errors.sourceName && (
                <p className="text-red-500 text-xs mt-1.5">{errors.sourceName.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-forest-leaf hover:bg-forest-leaf/90 h-11 text-sm font-semibold gap-2 shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
