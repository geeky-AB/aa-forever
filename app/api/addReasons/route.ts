// File: app/api/messages/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// request body
interface MessagePayload {
  reasonText:string,
}

export async function POST(request: Request) {
  try {
    const body: MessagePayload = await request.json();

    const { reasonText } = body;

    if (!reasonText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Your Firestore logic remains the same
    const docRef = await addDoc(collection(db, 'reasons'), {
      reasonText,
      submittedAt: serverTimestamp(),
    });

    return NextResponse.json(
      { message: 'Reason submitted successfully', id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding document: ', error);
    return NextResponse.json(
      { error: 'Failed to submit Reason' },
      { status: 500 }
    );
  }
}