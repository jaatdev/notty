// components/admin/RichTextEditor.tsx
'use client';
import React, { useCallback, useRef, useState } from 'react';
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
  const quillRef = useRef<any>(null);
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
        reader.onload = async () => {
          const base64 = reader.result as string; // data URL
          // upload to server
          const res = await fetch('/api/upload/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: base64, folder: 'notty' }),
          });
          const json = await res.json();
          if (json.url) {
            const editor = quillRef.current?.getEditor();
            const range = editor?.getSelection(true);
            editor?.insertEmbed(range?.index ?? 0, 'image', json.url);
            editor?.setSelection((range?.index ?? 0) + 1);
            setIsUploading(false);
          } else {
            console.error('upload failed', json);
            alert('Image upload failed');
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('image upload failed', err);
        alert('Image upload failed');
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
      <ReactQuill
        // @ts-expect-error - ref not in ReactQuillProps typing for React 19
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        style={{ minHeight }}
      />
      {isUploading && (
        <div className="mt-2 text-sm text-blue-400 animate-pulse">
          ⏳ Uploading image to cloud storage...
        </div>
      )}
    </div>
  );
}
