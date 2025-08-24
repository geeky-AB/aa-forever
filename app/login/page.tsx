'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/login', { password });
            setError('');
            if (response.data.role === 'admin') {
                router.push('/addReasons'); // Redirect admin to addReasons
            } else {
                router.push('/homepage'); // Redirect user to homepage
            }
        } catch (err) {
            setError('Incorrect password. Please try again.');
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-black dark:text-white dark:bg-gray-900">
            <div className="w-full max-w-sm rounded-lg text-black bg-white dark:bg-gray-800 p-8 text-center shadow-xl">
                <h1 className="mb-4 text-2xl dark:text-white font-bold">Enter Password to View Site</h1>
                <form onSubmit={handleSubmit}>
                    <div className="relative mt-1">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border-gray-600 bg-gray-200 p-2 pr-10 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.057 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 w-full rounded-md border border-transparent bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-700"
                    >
                        Enter
                    </button>
                    {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
                </form>
            </div>
        </main>
    );
}