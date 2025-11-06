// components/admin/NoteBoxPreview.tsx
'use client';

import React from 'react';
import { NoteBox } from '@/lib/admin-types';
import { themeMap } from '@/lib/admin-themes';

interface Props {
  note: NoteBox;
  interactive?: boolean;
}

export default function NoteBoxPreview({ note, interactive = false }: Props) {
  const theme = themeMap[note.themeId] ?? Object.values(themeMap)[0];

  const renderContent = () => {
    const content = note.content as any;

    switch (note.type) {
      case 'big-notes':
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">
              {content.heading}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {content.body}
            </p>
          </div>
        );

      case 'small-notes':
        return (
          <ul className="space-y-2">
            {content.points?.map((point: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span className="text-sm">{point}</span>
              </li>
            ))}
          </ul>
        );

      case 'right-wrong':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-2">
                ✓ Correct
              </h4>
              <ul className="space-y-1">
                {content.correct?.map((item: string, i: number) => (
                  <li key={i} className="text-sm text-green-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-700 mb-2">
                ✗ Incorrect
              </h4>
              <ul className="space-y-1">
                {content.incorrect?.map((item: string, i: number) => (
                  <li key={i} className="text-sm text-red-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'mnemonic-magic':
        return (
          <div className="space-y-3">
            <div className="text-2xl font-bold text-center text-indigo-600">
              {content.mnemonic}
            </div>
            {content.breakdown && (
              <div className="space-y-1">
                {Object.entries(content.breakdown).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <span className="font-bold text-indigo-600 w-8">
                      {key}:
                    </span>
                    <span className="text-sm">{value as string}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'mnemonic-card':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold">{content.title}</h4>
            <div className="flex flex-wrap gap-2">
              {content.items?.map((item: string, i: number) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        );

      case 'container-notes':
        return (
          <div className="space-y-3">
            {content.sections?.map((section: any, i: number) => (
              <div key={i} className="border-l-2 border-indigo-200 pl-3">
                <h4 className="font-semibold text-sm">{section.title}</h4>
                <p className="text-sm text-slate-600 mt-1">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        );

      case 'quick-reference':
        return (
          <dl className="grid grid-cols-2 gap-3">
            {content.facts?.map((fact: any) => (
              <div 
                key={fact.id} 
                className="p-2 bg-linear-to-br from-slate-50 to-indigo-50 rounded-lg"
              >
                <dt className="text-xs font-semibold text-slate-500 uppercase">
                  {fact.label}
                </dt>
                <dd className="text-sm font-medium mt-1">{fact.value}</dd>
              </div>
            ))}
          </dl>
        );

      case 'flashcard':
        return (
          <div className="space-y-3">
            {content.cards?.slice(0, interactive ? undefined : 1).map((card: any) => (
              <div 
                key={card.id} 
                className="group cursor-pointer"
              >
                <div className="p-4 bg-linear-to-br from-indigo-50 to-cyan-50 rounded-lg">
                  <div className="font-semibold text-sm">Q: {card.question}</div>
                  <div className="mt-2 text-sm text-slate-600 opacity-50 group-hover:opacity-100 transition-opacity">
                    A: {card.answer}
                  </div>
                </div>
              </div>
            ))}
            {!interactive && content.cards?.length > 1 && (
              <p className="text-xs text-slate-500 text-center">
                +{content.cards.length - 1} more cards
              </p>
            )}
          </div>
        );

      default:
        return (
          <pre className="text-xs text-slate-500 overflow-auto">
            {JSON.stringify(content, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div 
      className={`
        rounded-xl border overflow-hidden shadow-sm
        ${theme.borderColor} 
        ${interactive ? 'hover:shadow-md transition-shadow' : ''}
      `}
    >
      <div 
        className={`
          px-4 py-3 bg-linear-to-br 
          ${theme.gradient} 
          ${theme.textColor}
        `}
      >
        <div className="flex items-center justify-between">
          <h5 className="font-semibold">{note.title}</h5>
          <span className="text-xs opacity-75">
            {note.type.replace('-', ' ')}
          </span>
        </div>
      </div>

      <div className="p-4 bg-white">
        {renderContent()}
      </div>

      {interactive && note.updatedAt && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>ID: {note.id.slice(0, 8)}</span>
            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
