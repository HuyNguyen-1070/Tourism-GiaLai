import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RichTextEditor } from './RichTextEditor';
import { ImageUploader } from './ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/types/post';
import { FileText, ImageIcon, Tags, Globe, Send } from 'lucide-react';

const postSchema = z
  .object({
    title: z.string().min(10, 'Tiêu đề tối thiểu 10 ký tự').max(255, 'Tiêu đề tối đa 255 ký tự'),
    content: z.string().refine((val) => stripHtml(val).trim().length >= 50, {
      message: 'Nội dung phải có ít nhất 50 ký tự (không tính HTML)',
    }),
    summary: z.string().max(500, 'Tóm tắt tối đa 500 ký tự').optional(),
    tags: z
      .array(
        z.enum([
          'LOCATION',
          'CULTURE',
          'HISTORY',
          'FESTIVAL',
          'FOOD',
          'ACCOMMODATION',
          'TRANSPORT',
        ] as const)
      )
      .min(1, 'Chọn ít nhất 1 thẻ')
      .max(5, 'Tối đa 5 thẻ'),
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

const AVAILABLE_TAGS: { value: Tag; label: string; emoji: string }[] = [
  { value: 'LOCATION', label: 'Địa điểm', emoji: '📍' },
  { value: 'CULTURE', label: 'Văn hóa', emoji: '🎭' },
  { value: 'HISTORY', label: 'Lịch sử', emoji: '📜' },
  { value: 'FESTIVAL', label: 'Lễ hội', emoji: '🎪' },
  { value: 'FOOD', label: 'Ẩm thực', emoji: '🍜' },
  { value: 'ACCOMMODATION', label: 'Lưu trú', emoji: '🏨' },
  { value: 'TRANSPORT', label: 'Di chuyển', emoji: '🚌' },
];

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
  <div className="flex items-start gap-3 mb-5 pb-5 border-b border-outline-variant/10">
    <div className="w-9 h-9 rounded-xl bg-forest-leaf/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4.5 h-4.5 text-forest-leaf" />
    </div>
    <div>
      <h3 className="font-semibold text-on-surface text-sm">{title}</h3>
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

  const sourceType = watch('sourceType');
  const selectedTags = watch('tags');

  const toggleTag = (tag: Tag) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Core content section */}
      <div className="space-y-5">
        <SectionHeader
          icon={FileText}
          title="Nội dung bài viết"
          description="Tiêu đề, tóm tắt và nội dung chi tiết"
        />

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Tiêu đề <span className="text-red-400">*</span>
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                className="text-base font-medium"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold flex-shrink-0">
                !
              </span>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-on-surface">Tóm tắt</label>
            <span className="text-xs text-outline bg-surface-container px-2 py-0.5 rounded">
              {watch('summary')?.length || 0}/500
            </span>
          </div>
          <Controller
            name="summary"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                rows={3}
                placeholder="Một đoạn ngắn giúp độc giả hiểu nội dung bài trước khi đọc..."
                className="resize-none"
              />
            )}
          />
          {errors.summary && (
            <p className="text-red-500 text-xs mt-1.5">{errors.summary.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Nội dung chi tiết <span className="text-red-400">*</span>
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold flex-shrink-0">
                !
              </span>
              {errors.content.message}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-outline-variant/10 pt-6">
        <SectionHeader
          icon={ImageIcon}
          title="Hình ảnh"
          description="Ảnh đầu tiên sẽ được dùng làm ảnh đại diện"
        />
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUploader images={field.value || []} onChange={field.onChange} maxImages={10} />
          )}
        />
      </div>

      {/* Tags */}
      <div className="border-t border-outline-variant/10 pt-6">
        <SectionHeader
          icon={Tags}
          title="Thẻ phân loại"
          description="Chọn 1–5 thẻ phù hợp với nội dung bài viết"
        />
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map(({ value, label, emoji }) => (
            <button
              type="button"
              key={value}
              onClick={() => toggleTag(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
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
      <div className="border-t border-outline-variant/10 pt-6">
        <SectionHeader
          icon={Globe}
          title="Nguồn bài viết"
          description="Xác định quyền sở hữu nội dung"
        />
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Controller
            name="sourceType"
            control={control}
            render={({ field }) => (
              <>
                <button
                  type="button"
                  onClick={() => field.onChange('AUTHOR')}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    field.value === 'AUTHOR'
                      ? 'border-forest-leaf bg-forest-leaf/5'
                      : 'border-outline-variant/20 hover:border-forest-leaf/30'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${field.value === 'AUTHOR' ? 'border-forest-leaf bg-forest-leaf' : 'border-outline'}`}
                  />
                  <div>
                    <p
                      className={`font-semibold text-sm ${field.value === 'AUTHOR' ? 'text-forest-leaf' : 'text-on-surface'}`}
                    >
                      Tác giả gốc
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Nội dung do tôi sáng tác
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange('EXTERNAL')}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    field.value === 'EXTERNAL'
                      ? 'border-secondary bg-secondary/5'
                      : 'border-outline-variant/20 hover:border-secondary/30'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${field.value === 'EXTERNAL' ? 'border-secondary bg-secondary' : 'border-outline'}`}
                  />
                  <div>
                    <p
                      className={`font-semibold text-sm ${field.value === 'EXTERNAL' ? 'text-secondary' : 'text-on-surface'}`}
                    >
                      Nguồn bên ngoài
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Tổng hợp từ nguồn khác</p>
                  </div>
                </button>
              </>
            )}
          />
        </div>

        {sourceType === 'EXTERNAL' && (
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Tên nguồn <span className="text-red-400">*</span>
            </label>
            <Controller
              name="sourceName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="VD: Báo Gia Lai, Tạp chí Du lịch Việt Nam..." />
              )}
            />
            {errors.sourceName && (
              <p className="text-red-500 text-xs mt-1.5">{errors.sourceName.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="border-t border-outline-variant/10 pt-6">
        <Button
          type="submit"
          className="w-full bg-forest-leaf hover:bg-forest-leaf/90 h-12 text-base font-semibold gap-2"
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
