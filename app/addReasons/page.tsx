'use client';

import { useState, useEffect, useRef } from 'react'; 
import api from '@/lib/axios'; 


export default function SubmitMessagePage() {
    const [reason, setReason] = useState<string>('');
    const [category, setCategory] = useState<string>('Friend');
    const [status, setStatus] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); 
    const menuRef = useRef<HTMLDivElement>(null); 
    
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('Submitting...');
        try {
            await api.post('/addReasons', {
                reasonText: reason,
            });
            setStatus('Reason submitted successfully! Thank you!');
            setReason('');
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('Something went wrong. Please try again.');
        }
    };

    const handleSignOut = async () => {
            // try {
            //     await signOut(auth);
            //     setUser(null);
            //     setIsMenuOpen(false); // Close menu on sign out
            // } catch (error) {
            //     console.error("Sign out error:", error);
            //     setStatus('Failed to sign out.');
            // }
        };


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

                <h1 className="mb-4 text-center text-3xl font-bold">Add Reason Why you Love Her</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Reason</label>
                        <textarea id="reason" rows={4} value={reason} onChange={(e) => setReason(e.target.value)} required className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:bg-gray-700 shadow-sm"></textarea>
                    </div>
                    <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700">
                        Submit Reason
                    </button>
                    {status && <p className="mt-4 text-center text-gray-700 dark:text-gray-300">{status}</p>}
                </form>
            </div>
        </main>
    );
}