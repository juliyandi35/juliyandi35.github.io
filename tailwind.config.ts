import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        porcelain: "#F4F6F1",
        paper: "#FAFBF8",
        ink: "#171B18",
        graphite: "#59605B",
        hairline: "#CED4CE",
        oxide: "#1E6B55",
        "oxide-dark": "#154B3B",
      },
      fontFamily: {
        sans: ["var(--font-display)", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        surface: "12px",
        pill: "999px",
      },
      maxWidth: {
        editorial: "1440px",
      },
      transitionTimingFunction: {
        atelier: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        tinted: "0 1px 2px rgba(23, 27, 24, 0.04), 0 8px 24px -8px rgba(23, 27, 24, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
