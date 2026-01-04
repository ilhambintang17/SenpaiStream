
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#7e47eb",
                "secondary": "#AED9E0",
                "accent-pink": "#FFE5EC",
                "background-light": "#f9f8fc",
                "background-dark": "#161121",
                "glass-white": "rgba(255, 255, 255, 0.7)",
                "glass-border": "rgba(255, 255, 255, 0.5)",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
                "heading": ["Poppins", "sans-serif"],
            },
            borderRadius: { "DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px" },
        },
    },
    plugins: [],
}
