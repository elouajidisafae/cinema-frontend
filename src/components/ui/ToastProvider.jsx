import { Toaster } from 'react-hot-toast';

/**
 * Toast notification provider with custom styling
 * Wraps the application to enable toast notifications
 */
export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                // Default options
                duration: 4000,
                style: {
                    background: '#18181b', // zinc-900
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                },

                // Success toast
                success: {
                    duration: 3000,
                    style: {
                        border: '1px solid #10b981',
                    },
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                    },
                },

                // Error toast
                error: {
                    duration: 4000,
                    style: {
                        border: '1px solid #dc2626',
                    },
                    iconTheme: {
                        primary: '#dc2626',
                        secondary: '#fff',
                    },
                },

                // Loading toast
                loading: {
                    style: {
                        border: '1px solid #3b82f6',
                    },
                },
            }}
        />
    );
}
