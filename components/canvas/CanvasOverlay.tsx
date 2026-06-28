'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import getStroke from 'perfect-freehand';
import { Pen, Eraser, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Basic path generator for perfect-freehand
function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return '';
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );
  d.push('Z');
  return d.join(' ');
}

type Point = { x: number; y: number; pressure: number };

type Stroke = {
  id: string;
  points: Point[];
  color: string;
  size: number;
  isEraser: boolean;
};

interface CanvasOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CanvasOverlay({ isOpen, onClose }: CanvasOverlayProps) {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#ef4444'); // Default Red
  const [size, setSize] = useState<number>(4);

  const containerRef = useRef<HTMLDivElement>(null);

  // Disable body scroll when drawing
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    // Prevent default to avoid selection/scrolling
    (e.target as Element).setPointerCapture?.(e.pointerId);
    
    setIsDrawing(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = e.pressure !== 0 ? e.pressure : 0.5;

    setCurrentPoints([{ x, y, pressure }]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = e.pressure !== 0 ? e.pressure : 0.5;

    setCurrentPoints((prev) => [...prev, { x, y, pressure }]);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.length > 0) {
      const newStroke: Stroke = {
        id: Date.now().toString(),
        points: currentPoints,
        color,
        size,
        isEraser: tool === 'eraser',
      };
      setStrokes((prev) => [...prev, newStroke]);
    }
    setCurrentPoints([]);
  };

  const clearCanvas = () => setStrokes([]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col pointer-events-none">
      
      {/* Drawing Area */}
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full pointer-events-auto touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg className="w-full h-full">
          <defs>
            <mask id="eraser-mask">
              <rect width="100%" height="100%" fill="white" />
              {strokes.filter(s => s.isEraser).map((stroke) => {
                const input = stroke.points.map(p => [p.x, p.y, p.pressure]);
                const strokeData = getStroke(input, { size: stroke.size * 5, thinning: 0.5, streamline: 0.5 });
                const pathData = getSvgPathFromStroke(strokeData);
                return <path key={stroke.id} d={pathData} fill="black" />;
              })}
              {tool === 'eraser' && currentPoints.length > 0 && (
                <path 
                  d={getSvgPathFromStroke(getStroke(currentPoints.map(p => [p.x, p.y, p.pressure]), { size: size * 5, thinning: 0.5, streamline: 0.5 }))} 
                  fill="black" 
                />
              )}
            </mask>
          </defs>

          <g mask="url(#eraser-mask)">
            {strokes.filter(s => !s.isEraser).map((stroke) => {
              const input = stroke.points.map(p => [p.x, p.y, p.pressure]);
              const strokeData = getStroke(input, { size: stroke.size, thinning: 0.5, streamline: 0.5 });
              const pathData = getSvgPathFromStroke(strokeData);
              return <path key={stroke.id} d={pathData} fill={stroke.color} />;
            })}
            
            {tool === 'pen' && currentPoints.length > 0 && (
              <path 
                d={getSvgPathFromStroke(getStroke(currentPoints.map(p => [p.x, p.y, p.pressure]), { size, thinning: 0.5, streamline: 0.5 }))} 
                fill={color} 
              />
            )}
          </g>
        </svg>
      </div>

      {/* Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 p-2 bg-gray-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
        >
          {/* Colors */}
          <div className="flex gap-2 p-1 border-r border-white/10 pr-3">
            {[
              { id: '#ef4444', label: 'Red' },
              { id: '#3b82f6', label: 'Blue' },
              { id: '#eab308', label: 'Yellow' },
              { id: '#ffffff', label: 'White' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => { setTool('pen'); setColor(c.id); }}
                className={`w-8 h-8 rounded-full transition-transform ${tool === 'pen' && color === c.id ? 'scale-110 ring-2 ring-white/50' : 'hover:scale-105'}`}
                style={{ backgroundColor: c.id }}
                title={c.label}
              />
            ))}
          </div>

          {/* Tools */}
          <div className="flex gap-2 p-1 border-r border-white/10 pr-3 pl-1">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-xl transition-colors ${tool === 'pen' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              title="Pen"
            >
              <Pen className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-xl transition-colors ${tool === 'eraser' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              title="Eraser"
            >
              <Eraser className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-1 pl-1">
            <button
              onClick={clearCanvas}
              className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
              title="Clear Canvas"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Canvas"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
