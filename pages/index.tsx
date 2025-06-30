
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>CSVEconomics</title>
      </Head>
      <main className="min-h-screen p-8 flex flex-col items-center justify-center bg-gray-100 text-center">
        <h1 className="text-5xl font-bold mb-6">Willkommen bei CSVEconomics</h1>
        <p className="text-xl max-w-xl">
          Analysiere deine CSV-Daten mit künstlicher Intelligenz. Einfach hochladen, Fragen stellen, Ergebnisse erhalten.
        </p>
        <a href="/pricing" className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          Jetzt starten
        </a>
      </main>
    </>
  );
}
