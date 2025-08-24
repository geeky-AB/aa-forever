// File: app/api/messages/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// request body
interface MessagePayload {
  authorName: string;
  authorEmail: string;
  messageContent: string;
  authorCategory: string;
}

export async function POST(request: Request) {
  try {
    const body: MessagePayload = await request.json();

    const { authorName, authorEmail, messageContent, authorCategory } = body;

    if (!authorName || !authorEmail || !messageContent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Your Firestore logic remains the same
    const docRef = await addDoc(collection(db, 'messages'), {
      authorName,
      authorEmail,
      messageContent,
      authorCategory,
      submittedAt: serverTimestamp(),
    });

    return NextResponse.json(
      { message: 'Message submitted successfully', id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding document: ', error);
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    );
  }
}