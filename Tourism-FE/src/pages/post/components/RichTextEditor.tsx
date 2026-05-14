import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Bắt đầu viết câu chuyện của bạn...',
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current?.focus();
  };

  return (
    <div className="border border-outline/20 rounded-lg overflow-hidden">
      <div className="bg-surface-container border-b border-outline/10 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-mist-beige rounded"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-mist-beige rounded"
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 hover:bg-mist-beige rounded"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-mist-beige rounded"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-mist-beige rounded"
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Nhập link URL');
            if (url) execCommand('createLink', url);
          }}
          className="p-2 hover:bg-mist-beige rounded"
        >
          🔗 Link
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-6 bg-white focus:outline-none font-body-md"
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
};
