"use client";

import React, { useState } from 'react';
import { fallacyTypeJapanese } from '../fallacyTypes';
import FallacyExplanation from '../FallacyExplanation';

const FallaciesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFallacies = Object.keys(fallacyTypeJapanese).filter((type) =>
        fallacyTypeJapanese[type as keyof typeof fallacyTypeJapanese].name.includes(searchTerm) ||
        fallacyTypeJapanese[type as keyof typeof fallacyTypeJapanese].explanation.includes(searchTerm)
    );

    return (
        <main className="max-w-4xl mx-auto p-4 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">誤謬の一覧</h1>
            <input
                type="text"
                placeholder="検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border rounded-md"
            />
            {filteredFallacies.map((type) => (
                <FallacyExplanation key={type} type={type} />
            ))}
        </main>
    );
};

export default FallaciesPage;
