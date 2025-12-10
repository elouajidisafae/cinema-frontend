export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Bienvenue au Cinéma 🎬</h1>
        <p className="text-gray-600 mb-6">
          Découvrez nos films, réservez vos places et profitez d'une expérience inoubliable.
        </p>
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transform transition">
          Réserver Maintenant
        </button>
      </div>
    </div>
  );
}
