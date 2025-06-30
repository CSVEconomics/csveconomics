'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { data: session } = useSession();

  const [csvData, setCsvData] = useState<any[] | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingUses, setRemainingUses] = useState<number>(3);

  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user?.email) {
      const savedUses = localStorage.getItem(`uses_${session.user.email}`);
      setRemainingUses(savedUses ? parseInt(savedUses) : 3);
    }
  }, [session]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data as any[]);
      },
    });
  };

  const handleAsk = async () => {
    if (!csvData || !question || remainingUses <= 0) return;
    setLoading(true);

    const formattedCsv = csvData.map((row, index) => `Zeile ${index + 1}: ${Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(', ')}`).join('\n');
    const prompt = `Du bist ein Datenanalyse-Tool. Beantworte die folgende Frage auf Basis der folgenden CSV-Daten.\nDaten:\n${formattedCsv}\nFrage: ${question}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Du bist ein hilfsbereites Datenanalyse-Tool.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const result = await response.json();
    if (result?.choices?.[0]?.message?.content) {
      setAnswer(result.choices[0].message.content);
    } else {
      setAnswer('Keine gültige Antwort erhalten.');
    }

    setLoading(false);

    if (typeof window !== 'undefined' && session?.user?.email) {
      const updatedUses = remainingUses - 1;
      setRemainingUses(updatedUses);
      localStorage.setItem(`uses_${session.user.email}`, updatedUses.toString());
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 font-sans bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center border-b pb-6 mb-12">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="CSVEconomics Logo" width={48} height={48} />
          <h1 className="text-3xl font-extrabold tracking-tight text-green-600">CSVEconomics</h1>
        </Link>
        <div className="mt-4 sm:mt-0">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm">👋 Hallo, {session.user.name || 'Benutzer'}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Analysiere deine CSV-Dateien mit KI</h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Lade deine Datei hoch, stelle Fragen – CSVEconomics liefert präzise Antworten in Sekunden.
        </p>
      </section>

      {/* Tool Interface */}
      <section className="bg-white p-8 rounded-xl shadow-md">
        {!session?.user ? (
          <p className="text-center text-gray-500 text-lg">Bitte melde dich an, um das Tool zu nutzen.</p>
        ) : (
          <>
            <p className="text-right text-sm text-gray-500 mb-2">
              Verbleibende kostenlose Analysen: <strong>{remainingUses}</strong>
            </p>

            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />

              <textarea
                placeholder="Frage eingeben..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full"
                rows={4}
              />

              <button
                onClick={handleAsk}
                disabled={loading || !csvData || !question || remainingUses <= 0}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition disabled:opacity-50"
              >
                {loading ? 'Analysiere...' : 'Analyse starten'}
              </button>

              {answer && (
                <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-800 mb-2">Antwort:</h3>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">{answer}</pre>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* Premium Banner */}
      <section className="mt-20 text-center bg-blue-50 border border-blue-200 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-blue-700 mb-2">Mehr Power mit Premium</h3>
        <p className="text-blue-600 mb-4 text-base sm:text-lg">
          Unbegrenzte Analysen, schneller Support & bevorzugte Verarbeitung.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition">
          Upgrade auf Premium
        </button>
      </section>
    </main>
  );
}
