module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: "#003d82",
        rose: "#E0F2FE",
        beige: "#F8FAFC",
        dark: "#0F172A",
        "navy": "#003d82",
        "sky-light": "#0EA5E9",
        "primary-dark": "#1a365d", // Dark blue for marketplace
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideIn: "slideIn 0.5s ease-in-out",
        "fade-in-down": "fadeInDown 0.8s ease-out forwards",
        "fade-in-delay-1": "fadeInDown 0.8s ease-out 0.2s forwards",
        "fade-in-delay-2": "fadeInDown 0.8s ease-out 0.4s forwards",
        "fade-in-delay-3": "fadeInDown 0.8s ease-out 0.6s forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-up-delay": "fadeInUp 0.8s ease-out 0.2s forwards",
        blob: "blob 7s infinite",
        "blob-delay-1": "blob 7s infinite 1s",
        "blob-delay-2": "blob 7s infinite 2s",
        "slide-in-left": "slideInLeft 0.8s ease-out forwards",
        "slide-in-right": "slideInRight 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
        "rotate-in": "rotateIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeInDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeInUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-50px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(50px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        rotateIn: {
          "0%": { transform: "rotate(-10deg)", opacity: "0" },
          "100%": { transform: "rotate(0)", opacity: "1" },
        },
        blob: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
}
