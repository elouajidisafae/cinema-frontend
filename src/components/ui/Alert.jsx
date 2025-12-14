export default function Alert({ children, className = "" }) {
    return (
        <div className={`p-3 rounded-md bg-red-100 text-red-700 border border-red-300 ${className}`}>
            {children}
        </div>
    );
}
