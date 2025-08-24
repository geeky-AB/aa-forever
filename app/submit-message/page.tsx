'use client';

import { useState, useEffect, useRef } from 'react'; // Import useRef
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, signOut } from "firebase/auth";
import { app } from '@/lib/firebase';
import api from '@/lib/axios';

const auth = getAuth(app);

export default function SubmitMessagePage() {
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState<string>('');
    const [category, setCategory] = useState<string>('Friend');
    const [status, setStatus] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // NEW: State for the menu
    const menuRef = useRef<HTMLDivElement>(null); // NEW: Ref to detect outside clicks

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // NEW: Effect to handle clicks outside the menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Authentication error:", error);
            setStatus('Failed to sign in.');
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsMenuOpen(false); // Close menu on sign out
        } catch (error) {
            console.error("Sign out error:", error);
            setStatus('Failed to sign out.');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            setStatus('You must be signed in to submit a message.');
            return;
        }
        setStatus('Submitting...');
        try {
            await api.post('/messages', {
                authorName: user.displayName,
                authorEmail: user.email,
                messageContent: message,
                authorCategory: category,
            });
            setStatus('Message submitted successfully! Thank you!');
            setMessage('');
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('Something went wrong. Please try again.');
        }
    };

    if (!user) {
        // ... (The sign-in page JSX remains the same)
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-black dark:text-white dark:bg-gray-900">
                <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 text-center shadow-md">
                    <h1 className="mb-4 text-2xl font-bold">Please Sign In</h1>
                    <p className="mb-6 text-gray-700 dark:text-gray-300">
                        To leave a message, please sign in with your Google account. This ensures all messages are from friends and family.
                    </p>
                    <button
                        onClick={handleSignIn}
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        Sign in with Google
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8 text-black dark:text-white dark:bg-gray-900">
            <div className="relative w-full max-w-xl rounded-lg bg-white dark:bg-gray-800 p-8 shadow-md">
                {/* NEW: Three-dot menu */}
                <div ref={menuRef} className="absolute top-4 right-4">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        {/* Three dots SVG icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>

                    {/* NEW: Dropdown menu content */}
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <h1 className="mb-4 text-center text-3xl font-bold">Leave a Birthday Message</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... (The rest of your form JSX remains here) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                        <input type="text" value={user?.displayName || 'No name found'} readOnly className="mt-1 block p-2 w-full rounded-md border-gray-300 dark:bg-gray-700 bg-gray-100 shadow-sm sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Who are you?</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700">
                            <option>Friend</option>
                            <option>Family</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Message</label>
                        <textarea id="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:bg-gray-700 shadow-sm"></textarea>
                    </div>
                    <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700">
                        Submit Message
                    </button>
                    {status && <p className="mt-4 text-center text-gray-700 dark:text-gray-300">{status}</p>}
                </form>
            </div>
        </main>
    );
}