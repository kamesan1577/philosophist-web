import React from 'react';
import { fallacyTypeJapanese } from './fallacyTypes';

const FallacyExplanation = ({ type }: { type: string }) => {
    const fallacy = fallacyTypeJapanese[type as keyof typeof fallacyTypeJapanese];
    return (
        <div className="border rounded-lg p-4 mb-4 shadow-lg bg-white">
            <h4 className="font-bold">{fallacy.name}</h4>
            <p className="text-gray-700">{fallacy.explanation}</p>
        </div>
    );
};

export default FallacyExplanation;
