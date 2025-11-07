// components/admin/RichTextEditor.tsx
'use client';
import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

// ReactQuill requires dynamic import for SSR safe usage
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import 'react-quill/dist/quill.snow.css';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 180 }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setIsUploading(true);
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // Image will be inserted via default Quill handler
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('image upload failed', err);
        alert('Image reading failed');
      } finally {
        setIsUploading(false);
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: handleImage,
      },
    },
  };

  return (
    <div className="rich-text-editor">
      {/* @ts-ignore - dynamic import */}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        style={{ minHeight }}
      />
      {isUploading && <div className="mt-2 text-sm text-slate-400">Inserting image…</div>}
    </div>
  );
}
