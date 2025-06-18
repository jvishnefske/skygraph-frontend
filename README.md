# 🚀 Skygraph Frontend: Charting the Future of Numerical Analysis! 🌌

Welcome, trailblazer! ✨ Are you ready to dive into the fascinating world where mathematics meets cutting-edge web technology? 🌐 Skygraph Frontend
 is your playground for exploring numerical analysis right in your browser, pushing the boundaries of what's possible on the client-side. No more w
aiting for servers – unleash the power of computation directly in your hands! 💻💡

This project is a journey from traditional web development to a modern, reactive, and highly testable architecture. We're building the future, one 
equation at a time! 📈✨

## 🌟 Badges of Honor (and Rizz!) 🌟

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Jest](https://img.shields.io/badge/Tests-Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![JavaScript](https://img.shields.io/badge/Language-ES6%2B-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/J
avaScript)
[![CSS3](https://img.shields.io/badge/Styling-CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Open Source Love](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-ff69b4.svg)](https://github.com/jvishnefske/skygraph-frontend)
[![Pull Requests Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](https://github.com/jvishnefske/skygraph-frontend/pulls)

## 🎯 Project Overview

Skygraph Frontend is an interactive web application designed to demonstrate numerical analysis methods. Imagine typing a complex mathematical equat
ion and seeing its graph, its JavaScript translation, and numerical approximations, all computed instantly in your browser! This project aims to:

*   **Empower Client-Side Computation:** Reduce server load by performing heavy numerical tasks directly in the user's browser.
*   **Visualize Complex Math:** Make abstract mathematical concepts tangible through interactive graphing and output.
*   **Showcase Modern Web Dev:** Serve as a living example of migrating from legacy tools (jQuery, Grunt, Bower) to a sleek, component-based archit
ecture with Vue.js and Vite.

## ✨ Features (Current & Upcoming)

*   **Real-time Math Parsing:** Convert mathematical expressions into a parse tree and executable JavaScript.
*   **Dynamic MathJax Rendering:** See your equations beautifully typeset in LaTeX.
*   **Interactive Input:** Easily input and modify equations.
*   **Example Equations:** Quick access to pre-defined examples to get started.
*   **Modern Tooling:** Built with Vue 3, Vite, and Jest for a blazing-fast developer experience.

## 🚀 Getting Started: Your First Leap!

Ready to contribute or just explore? Follow these simple steps to get Skygraph Frontend up and running on your local machine.

### Prerequisites

Make sure you have Node.js and Yarn (or npm) installed.

*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [Yarn](https://yarnpkg.com/getting-started/install) (or npm, which comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jvishnefske/skygraph-frontend.git
    cd skygraph-frontend
    ```
2.  **Install dependencies:**
    ```bash
    yarn install
    # or npm install
    ```

### Running the Development Server

Start the Vite development server to see your changes in real-time.

```bash
yarn dev
# or npm run dev
```
This will typically open the application in your browser at `http://localhost:5173` (or a similar port).

### Building for Production

Generate optimized static assets for deployment.

```bash
yarn build
# or npm run build
```
The build output will be in the `dist/` directory.

### Running Unit Tests

Ensure everything is working as expected by running the unit tests.

```bash
yarn test
# or npm test
```

## 🤝 Contributing: Be a Part of the Revolution!

We believe in the power of collaboration! Whether you're a seasoned developer or just starting your coding journey, your contributions are invaluable. Here's how you can make a difference:

1.  **Fork the repository.** 🍴
2.  **Create a new branch:** `git checkout -b feature/your-awesome-feature`
3.  **Make your changes and commit them:** `git commit -m 'feat: Add amazing new feature'`
4.  **Push to your branch:** `git push origin feature/your-awesome-feature`
5.  **Open a Pull Request!** 🎉 Explain your changes, and let's build something incredible together!

### Areas Where Your Genius Can Shine (Future Plans & Needed Changes)

This project is a living canvas, and there's so much more to build! Here are some exciting challenges waiting for you:

*   **Complete Vue.js Migration:**
    *   Refactor `app/App.vue` into smaller, reusable Vue components (e.g., `MathInputForm.vue`, `OutputDisplay.vue`, `ChartComponent.vue`).
    *   Ensure all DOM manipulations and event listeners are fully reactive Vue patterns.
*   **Full jQuery Deprecation:**
    *   While much of the jQuery has been removed, ensure no hidden dependencies remain, especially in `app/js/mathlex.js` if it's ever refactored.
*   **Enhanced `mathParser.js`:**
    *   Implement robust handling for complex MathLex node types (integrals, sums, products, set operations, vector/matrix ops) that currently return placeholders. This might involve integrating dedicated numerical libraries.
    *   **Crucially, replace `eval` / `new Function` with a safer, sandboxed execution environment** for user-defined mathematical functions to mitigate security risks. This is a high-priority task! 🔒
*   **Advanced Charting:**
    *   Fully integrate Chart.js to dynamically plot functions and numerical results.
    *   Explore interactive features for zooming, panning, and data point inspection.
*   **Modern CSS Practices:**
    *   Organize `app/styles/screen.css` into component-scoped styles or explore CSS preprocessors (Sass/Less) or utility-first frameworks (Tailwind CSS) for a more maintainable styling approach.
*   **Comprehensive Testing:**
    *   Expand unit tests to cover more `mathParser.js` cases and all new Vue components.
    *   Add integration tests to ensure different parts of the application work together seamlessly.
*   **Numerical Methods Implementation:**
    *   Implement actual numerical integration (e.g., Trapezoidal Rule, Simpson's Rule) and Monte Carlo methods based on the parsed functions.
    *   Allow users to configure parameters for these methods (e.g., number of steps `n`).
*   **User Experience Improvements:**
    *   Add loading indicators for complex computations.
    *   Improve error messages for parsing and computation failures.
    *   Consider a more intuitive UI for defining integration bounds or other parameters.
*   **Deployment Automation:**
    *   Set up CI/CD pipelines (e.g., GitHub Actions) to automate testing and deployment.

Your ideas, bug reports, and code are all welcome! Let's build something amazing together! 🚀✨

## 📄 License

This project is licensed under the ISC License. See the `LICENSE` file for details.


