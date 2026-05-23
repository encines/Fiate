import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export async function POST(req: Request) {
  try {
    const { base64, fileExt, userId, carId } = await req.json();

    if (!base64 || !userId || !carId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    const fileName = `${userId}/${carId}/${Date.now()}.${fileExt || 'jpg'}`;
    const buffer = Buffer.from(base64, 'base64');

    const { data, error } = await supabaseAdmin.storage
      .from('services')
      .upload(fileName, buffer, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        upsert: true,
      });

    if (error) {
      console.error('Admin upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ path: data.path }, { status: 200 });
  } catch (error: any) {
    console.error('API upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
