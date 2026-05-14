import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RichTextEditor } from './RichTextEditor';
import { ImageUploader } from './ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/types/post';

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
      if (data.sourceType === 'EXTERNAL' && !data.sourceName) {
        return false;
      }
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

const AVAILABLE_TAGS: Tag[] = [
  'LOCATION',
  'CULTURE',
  'HISTORY',
  'FESTIVAL',
  'FOOD',
  'ACCOMMODATION',
  'TRANSPORT',
];

interface PostFormProps {
  defaultValues?: Partial<PostFormValues>;
  onSubmit: (data: PostFormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export const PostForm = ({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Gửi duyệt',
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Title */}
      <div>
        <label className="block font-label-md text-on-surface mb-2">Tiêu đề *</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Nhập tiêu đề bài viết..." />}
        />
        {errors.title && <p className="text-error text-label-sm mt-1">{errors.title.message}</p>}
      </div>

      {/* Summary */}
      <div>
        <div className="flex justify-between">
          <label className="block font-label-md text-on-surface mb-2">Tóm tắt</label>
          <span className="text-label-sm text-outline">{watch('summary')?.length || 0}/500</span>
        </div>
        <Controller
          name="summary"
          control={control}
          render={({ field }) => (
            <Textarea {...field} rows={3} placeholder="Tóm tắt ngắn gọn nội dung bài viết..." />
          )}
        />
        {errors.summary && (
          <p className="text-error text-label-sm mt-1">{errors.summary.message}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block font-label-md text-on-surface mb-2">Nội dung *</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
        />
        {errors.content && (
          <p className="text-error text-label-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* Images */}
      <div>
        <label className="block font-label-md text-on-surface mb-2">Hình ảnh</label>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUploader images={field.value || []} onChange={field.onChange} maxImages={10} />
          )}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block font-label-md text-on-surface mb-2">Thẻ phân loại *</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-label-sm transition-all ${selectedTags.includes(tag) ? 'bg-forest-leaf text-white' : 'bg-mist-beige border border-outline-variant text-on-surface-variant hover:border-forest-leaf'}`}
            >
              {tag}
            </button>
          ))}
        </div>
        {errors.tags && <p className="text-error text-label-sm mt-1">{errors.tags.message}</p>}
      </div>

      {/* Source Type */}
      <div>
        <label className="block font-label-md text-on-surface mb-2">Nguồn bài viết</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <Controller
              name="sourceType"
              control={control}
              render={({ field }) => (
                <input
                  type="radio"
                  value="AUTHOR"
                  checked={field.value === 'AUTHOR'}
                  onChange={() => field.onChange('AUTHOR')}
                  className="text-forest-leaf"
                />
              )}
            />
            Tác giả gốc
          </label>
          <label className="flex items-center gap-2">
            <Controller
              name="sourceType"
              control={control}
              render={({ field }) => (
                <input
                  type="radio"
                  value="EXTERNAL"
                  checked={field.value === 'EXTERNAL'}
                  onChange={() => field.onChange('EXTERNAL')}
                  className="text-forest-leaf"
                />
              )}
            />
            Nguồn bên ngoài
          </label>
        </div>
      </div>

      {sourceType === 'EXTERNAL' && (
        <div>
          <label className="block font-label-md text-on-surface mb-2">Tên nguồn *</label>
          <Controller
            name="sourceName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="VD: Báo Nhân Dân, Tạp chí Du lịch..." />
            )}
          />
          {errors.sourceName && (
            <p className="text-error text-label-sm mt-1">{errors.sourceName.message}</p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full bg-forest-leaf hover:opacity-90" disabled={isLoading}>
        {isLoading ? 'Đang xử lý...' : submitLabel}
      </Button>
    </form>
  );
};
