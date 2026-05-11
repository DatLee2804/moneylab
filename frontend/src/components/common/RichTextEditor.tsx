'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Palette,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/utils/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: placeholder || 'Nhập nội dung...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm text-[#0f172a] max-w-none focus:outline-none min-h-[150px] px-6 py-4 cursor-text bg-white',
      },
    },
  });

  if (!editor) return null;

  const colors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Green', value: '#baff02' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
  ];

  return (
    <div className="w-full border border-gray-200 rounded-3xl overflow-hidden bg-white transition-all focus-within:ring-2 focus-within:ring-[#baff02]/20 focus-within:border-[#baff02]/40">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700", editor.isActive('bold') && "bg-gray-200 text-black")}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700", editor.isActive('italic') && "bg-gray-200 text-black")}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700", editor.isActive('underline') && "bg-gray-200 text-black")}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r border-gray-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors font-bold text-gray-700", editor.isActive('heading', { level: 1 }) && "bg-gray-200 text-black")}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors font-bold text-gray-700", editor.isActive('heading', { level: 2 }) && "bg-gray-200 text-black")}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors font-bold text-gray-700", editor.isActive('heading', { level: 3 }) && "bg-gray-200 text-black")}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r border-gray-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700", editor.isActive({ textAlign: 'left' }) && "bg-gray-200 text-black")}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700", editor.isActive({ textAlign: 'center' }) && "bg-gray-200 text-black")}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700", editor.isActive({ textAlign: 'right' }) && "bg-gray-200 text-black")}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700", editor.isActive({ textAlign: 'justify' }) && "bg-gray-200 text-black")}
            title="Justify"
          >
            <AlignJustify size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r border-gray-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700", editor.isActive('bulletList') && "bg-gray-200 text-black")}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn("p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700", editor.isActive('orderedList') && "bg-gray-200 text-black")}
            title="Ordered List"
          >
            <ListOrdered size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="group relative">
            <button type="button" className="p-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1 text-gray-700">
              <Palette size={16} />
              <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: editor.getAttributes('textStyle').color || 'currentColor' }} />
            </button>
            <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover:flex gap-1 z-50 animate-in fade-in slide-in-from-top-1">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  onClick={() => editor.chain().focus().setColor(color.value).run()}
                  className="w-6 h-6 rounded-md border border-gray-200 hover:scale-110 transition-transform shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
            title="Xoá định dạng"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white min-h-[150px]">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          color: #0f172a !important;
        }
        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
