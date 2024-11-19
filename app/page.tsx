"use client";

import { useState } from 'react';

// 詭弁タイプの日本語マッピング
const fallacyTypeJapanese = {
  ad_hominem: '人身攻撃',
  straw_man: 'わら人形論法',
  false_dichotomy: '二分法の誤り',
  slippery_slope: '滑りやすい坂道',
  appeal_to_authority: '権威への訴え',
  hasty_generalization: '性急な一般化',
  circular_reasoning: '循環論法',
  appeal_to_emotion: '感情への訴え',
  red_herring: 'レッドヘリング',
  bandwagon: '便乗論法',
  false_cause: '偽因の誤謬',
  appeal_to_tradition: '伝統への訴え',
  tu_quoque: 'あなたもそうだ論法',
  no_true_scotsman: '本物のスコットランド人論法'
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toISOString().replace('T', ' ').substring(0, 19);
  } catch {
    return '不明';
  }
};

type TextSpan = {
  start: number;
  end: number;
};

type FallacyType = {
  type: string;
  confidence: number;
  explanation: string;
  relevant_text: string;
  text_span: TextSpan;
};

// 特殊文字をエスケープする関数
const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// テキストに詭弁箇所のハイライトを適用する関数
const highlightText = (text: string, fallacyTypes: FallacyType[]) => {
  if (!fallacyTypes || fallacyTypes.length === 0) return escapeHtml(text);

  let result = escapeHtml(text);

  fallacyTypes.forEach(fallacy => {
    const escapedRelevantText = escapeHtml(fallacy.relevant_text);
    const highlightSpan = `<span class="bg-yellow-200 hover:bg-yellow-300 cursor-help" title="${escapeHtml(fallacyTypeJapanese[fallacy.type as keyof typeof fallacyTypeJapanese] || fallacy.type)}: ${escapeHtml(fallacy.explanation)}">${escapedRelevantText}</span>`;
    result = result.replace(new RegExp(escapedRelevantText, 'g'), highlightSpan);
  });

  return result;
};

export default function FallacyJudge() {
  const [text, setText] = useState('');
  type ResultType = {
    is_fallacy: boolean;
    confidence_score: number;
    input: string;
    fallacy_types: FallacyType[];
    metadata?: {
      analysis_timestamp?: string;
    };
  } | null;

  const [result, setResult] = useState<ResultType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language: 'ja' }),
      });

      if (!response.ok) {
        throw new Error('APIリクエストに失敗しました');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">詭弁チェッカー</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="判定したいテキストを入力してください（例：彼の意見は信用できない。なぜなら彼は若すぎるからだ。）"
              className="w-full min-h-[120px] p-3 border rounded-md"
            />
            <p className="text-sm text-gray-500">
              {text.length}/1000文字
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className={`w-full py-2 px-4 rounded-md text-white ${loading || !text.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? '判定中...' : '判定する'}
          </button>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">判定結果</h2>

          <div className="border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-lg font-semibold ${result.is_fallacy ? 'text-red-600' : ''}`}>
                  {result.is_fallacy ? '⚠️ 詭弁の可能性があります' : '✅ 詭弁の可能性は低いです'}
                </p>
                <p className="text-sm text-gray-600">
                  確信度: {(result.confidence_score * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">
                  ハイライトは正確でない可能性があります。
                </p>
              </div>
            </div>
          </div>

          {/* 入力テキストの表示（ハイライト付き） */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">入力テキスト</h3>
            <p
              className="leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightText(result.input, result.fallacy_types)
              }}
            />
          </div>

          {result.fallacy_types && result.fallacy_types.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">検出された詭弁</h3>
              {result.fallacy_types.map((fallacy: FallacyType, index: number) => (
                <div key={index} className={`border rounded-lg p-4 ${result.is_fallacy ? 'bg-red-50' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">
                      {fallacyTypeJapanese[fallacy.type as keyof typeof fallacyTypeJapanese] || fallacy.type}
                    </h4>
                    <span className="text-sm text-gray-600">
                      確信度: {(fallacy.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  {fallacy.relevant_text}
                  <p className="text-gray-700 mb-3">{fallacy.explanation}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-500 mt-4">
            分析時刻: {result.metadata?.analysis_timestamp ?
              formatDate(result.metadata.analysis_timestamp) :
              '不明'
            }
          </div>
        </div>
      )}
    </main>
  );
}
