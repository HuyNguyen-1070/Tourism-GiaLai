import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentFormProps {
    onSubmit: (content: string) => void;
    isSubmitting: boolean;
}

export const CommentForm = ({ onSubmit, isSubmitting }: CommentFormProps) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim().length === 0) return;
        onSubmit(content);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <Textarea
                placeholder="Chia sẻ cảm nghĩ của bạn về bài viết..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="resize-none"
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !content.trim()}>
                    {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
                </Button>
            </div>
        </form>
    );
};