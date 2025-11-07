// app/api/upload/supabase/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { data, filename } = await req.json(); // data is dataURL
    if (!data) return NextResponse.json({ error: 'no data' }, { status: 400 });

    // convert dataURL to binary
    const base64 = data.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const key = `notty/${Date.now()}-${filename || 'img'}.png`;

    const { error } = await supabase.storage.from('public-bucket').upload(key, buffer, {
      contentType: 'image/png',
      upsert: false,
    });

    if (error) throw error;

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-bucket/${key}`;
    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (err: any) {
    console.error('Supabase upload error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
