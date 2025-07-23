
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Couleurs africaines inspirées
				'african-gold': {
					'50': '#fefdf2',
					'100': '#fef9e2',
					'200': '#fcf0c0',
					'300': '#f7e394',
					'400': '#f0cf5c',
					'500': '#e8b938',
					'600': '#d19b2b',
					'700': '#ae7c24',
					'800': '#8d6224',
					'900': '#745122',
				},
				'african-earth': {
					'50': '#faf7f3',
					'100': '#f4ebe1',
					'200': '#e9d5c3',
					'300': '#dab89b',
					'400': '#ca9571',
					'500': '#bc7d55',
					'600': '#a96a49',
					'700': '#8c543e',
					'800': '#714538',
					'900': '#5c3a30',
				},
				'african-green': {
					'50': '#f2f9f1',
					'100': '#e1f2df',
					'200': '#c4e4c1',
					'300': '#96cf95',
					'400': '#61b461',
					'500': '#3d9940',
					'600': '#2f7d32',
					'700': '#28632a',
					'800': '#235025',
					'900': '#1e4220',
				},
				'african-terracotta': {
					'50': '#fdf5f3',
					'100': '#fbeae5',
					'200': '#f6d6cd',
					'300': '#efb8a8',
					'400': '#e59176',
					'500': '#d97654',
					'600': '#c85d3a',
					'700': '#a84e30',
					'800': '#8b442d',
					'900': '#733c2c',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.8s ease-out'
			},
			backgroundImage: {
				'african-pattern': "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23d19b2b\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20zM40 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20z\"/%3E%3C/g%3E%3C/svg%3E')"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
