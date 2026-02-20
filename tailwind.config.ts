import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        night: {
          950: "#070b0a",
          900: "#0c1210",
          800: "#121a17",
          700: "#1a2621",
          600: "#24352d"
        },
        brand: {
          50: "#e6fff5",
          100: "#c8f5e2",
          200: "#9be9c9",
          300: "#5dd7ab",
          400: "#2fc28c",
          500: "#14a173",
          600: "#0f8a63",
          700: "#0c6d4f",
          800: "#0a553f",
          900: "#094437"
        },
        ink: {
          900: "#f2f6f4",
          800: "#dbe4df",
          700: "#b9c7bf",
          600: "#96a7a0",
          500: "#7a8b84"
        }
      },
      boxShadow: {
        card: "0 18px 40px rgba(8, 12, 10, 0.45)",
        soft: "0 12px 30px rgba(8, 12, 10, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "hero": "radial-gradient(circle at top left, #1a2a23 0%, #0c1210 45%, #070b0a 75%)",
        "grain": "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"140\" height=\"140\" viewBox=\"0 0 140 140\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"140\" height=\"140\" filter=\"url(%23n)\" opacity=\"0.08\"/></svg>')"
      }
    },
  },
  plugins: [],
} satisfies Config;
