export default function Button({ children, loading, className="", ...props }) {
    return (
        <button
            {...props}
            disabled={loading}
            className={`px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {loading ? "Chargement..." : children}
        </button>
    );
}