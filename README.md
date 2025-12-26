# Skygraph Frontend

Client-side numerical analysis and mathematical visualization in the browser. Parse mathematical expressions, render them with MathJax, and compute results without server-side processing.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## Quick Start

```bash
npm install
npm run dev
npm test
```

## Features

- Real-time mathematical expression parsing via MathLex
- LaTeX rendering with MathJax
- Interactive graphing with Chart.js
- Client-side numerical integration demonstrations
- Vue 3 + Vite modern build toolchain

## Development

```bash
make build    # Build for production
make test     # Run test suite
make lint     # Run linter
make coverage # Generate coverage report
make clean    # Clean build artifacts
```

## Architecture

The application follows a "Functional Core, Imperative Shell" pattern:
- Pure mathematical functions for parsing and computation
- UI layer handles I/O and user interactions
- State managed immutably through Vue's reactivity system

## License

ISC
