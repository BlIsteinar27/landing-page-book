import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface colors (backgrounds)
        'surface-1': '#0a0a0a',
        'surface-2': '#1a1a1a',
        'surface-3': '#2a2a2a',
        
        // Ink colors (text hierarchy)
        'ink-primary': '#ffffff',
        'ink-secondary': '#a0a0a0',
        'ink-tertiary': '#707070',
        'ink-muted': '#505050',
        
        // Border colors
        'border-default': '#333333',
        'border-subtle': '#222222',
        
        // Accent color
        'accent': '#8b5cf6', // Purple for cosmic theme
      },
      fontFamily: {
        display: ['Yudi', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
