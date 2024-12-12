
import React from 'react';
import { fallacyTypeJapanese } from './fallacyTypes';
import FallacyExplanation from './FallacyExplanation';

const FallaciesPage = () => {
    return (
        <main className="max-w-4xl mx-auto p-4 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">誤謬の一覧</h1>
            {Object.keys(fallacyTypeJapanese).map((type) => (
                <FallacyExplanation key={type} type={type} />
            ))}
        </main>
    );
};

export default FallaciesPage;
