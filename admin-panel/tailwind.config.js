
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
                primary: "#7e47eb",
                "primary-dark": "#6a3bc2",
                "background-light": "#f6f6f8",
                "background-dark": "#161121",
                "surface-dark": "#231e33",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"]
            }
        },
    },
    plugins: [],
}
