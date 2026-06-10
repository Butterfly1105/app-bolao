/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Test: if this appears in the CSS, config is being read
    'bg-purple-500',
    // Core layout
    'min-h-screen', 'flex', 'items-center', 'justify-center', 'relative', 'absolute',
    'inset-0', 'overflow-hidden', 'pointer-events-none', 'w-full', 'h-full',
    // Backgrounds
    'bg-gradient-to-br',
    'from-green-900', 'via-green-800', 'to-green-950',
    'from-green-800', 'to-green-900',
    'bg-green-500/10', 'bg-yellow-500/10', 'bg-green-600/5',
    'bg-white/10', 'bg-white/5', 'bg-white/20', 'bg-black/20',
    'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-gray-800', 'bg-gray-900',
    'bg-green-500', 'bg-green-600', 'bg-green-700',
    'bg-red-500', 'bg-yellow-400', 'bg-yellow-500',
    // Text
    'text-white', 'text-gray-100', 'text-gray-200', 'text-gray-300', 'text-gray-400',
    'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
    'text-green-400', 'text-green-500', 'text-green-600',
    'text-yellow-400', 'text-yellow-500',
    'text-red-400', 'text-red-500',
    'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
    'font-bold', 'font-semibold', 'font-medium', 'font-normal',
    // Sizing
    'w-96', 'h-96', 'w-full', 'max-w-md', 'max-w-lg', 'max-w-xl',
    'p-4', 'p-6', 'p-8', 'px-4', 'px-6', 'py-2', 'py-3', 'py-4',
    'mb-2', 'mb-4', 'mb-6', 'mt-2', 'mt-4', 'mt-6', 'space-y-4', 'space-y-6',
    'gap-2', 'gap-4', 'gap-6',
    // Borders & rounded
    'rounded', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full',
    'border', 'border-white/20', 'border-white/10', 'border-gray-200', 'border-gray-700',
    // Blur & shadows
    'blur-3xl', 'backdrop-blur-sm', 'shadow-lg', 'shadow-xl', 'shadow-2xl',
    // Flex & grid
    'flex-col', 'flex-row', 'grid', 'grid-cols-2', 'grid-cols-3',
    // Translate, position
    '-top-40', '-right-40', '-bottom-40', '-left-40',
    'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
    // Transitions
    'transition', 'transition-all', 'duration-200', 'duration-300',
    'hover:bg-green-700', 'hover:bg-green-600', 'hover:opacity-80',
    // Input
    'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500',
    'placeholder:text-gray-400',
    // Opacity
    'opacity-0', 'opacity-50', 'opacity-100',
    // Cursor
    'cursor-pointer', 'cursor-not-allowed',
    // Animate
    'animate-spin', 'animate-fade-in',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        border: 'hsl(214.3 31.8% 91.4%)',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
