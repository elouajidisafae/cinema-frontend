export default function Input({ label, className="", ...props }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium">{label}</label>}
            <input
                {...props}
                className={`border rounded px-3 py-2 focus:ring focus:ring-blue-200 ${className}`}
            />
        </div>
    );
}
