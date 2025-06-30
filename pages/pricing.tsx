
export default function Pricing() {
  return (
    <div className="min-h-screen p-10 bg-white text-black">
      <h1 className="text-4xl font-bold text-center mb-6">Preise</h1>
      <div className="flex justify-center">
        <div className="p-6 border rounded-lg shadow max-w-md">
          <h2 className="text-2xl font-semibold mb-2">Basic Plan</h2>
          <p className="mb-4">3 CSV-Analysen kostenlos. Ideal zum Testen.</p>
          <h2 className="text-2xl font-semibold mb-2">Premium Plan</h2>
          <p className="mb-4">Unbegrenzte Analysen, Support & Premium-Features.</p>
          <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Upgrade starten
          </button>
        </div>
      </div>
    </div>
  );
}
