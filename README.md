# <img src="public/favicon.svg" alt="FlowTyping Logo" width="36" align="top" /> FlowTyping

> **FlowTyping** is a premium, fluid, and highly customizable online typing simulation and IME learning environment. Built using Svelte 5, TypeScript, and TailwindCSS, it models a realistic mechanical keyboard typing experience and custom IME (Input Method Editor) composition.

---

## Core Features

### 1. Dual Keyboard Layout Engine
* **Taiwan Zhuyin (Bopomofo) Mode**: Integrated custom phonetic engine that parses key sequences into bopomofo syllables, handles tones, and dynamically displays dictionary-assisted candidate lists for selection.
* **English (US QWERTY) Mode**: A layout-independent typing capture system using physical keycodes (`e.code`), ensuring correct English character input regardless of your local operating system's keyboard layout. Fully simulates physical CapsLock and Shift XOR logic.

### 2. High-Fidelity Customization & Aesthetics
* **Dynamic Presets**: Swap between beautifully crafted presets such as *Cyber Cyan, Charcoal Dark, Charcoal Light, Retro Mechanical, Vintage Beige, Wood Grain,* and *Sakura Pink*.
* **Interactive RGB Lighting**: Enable dynamic multi-color RGB borders and breathing glow backlights under keycaps.
* **Adjustable Typography**: Supports setting system scale and typing text area sizes dynamically from `6pt` to `32pt`.
* **Collapsible Options Panel**: Personalization drawer with scroll overflow safety and a custom webkit scrollbar.

### 3. Checkbox-Based Hotkey Configurations
* Configure your own layout switching shortcut in the **Advanced Settings** menu (collapsible via arrow toggle).
* Select combinations of keys using checkboxes: `Ctrl`, `Space`, `Shift`, `CapsLock`, `Tab`, `Alt`, `L-Ctrl`, `R-Ctrl`, `L-Shift`, and `R-Shift`.
* Supports **smart modifier-only release** (e.g. smart short Shift press check) and instant **multi-key combinations** (e.g. `Ctrl + Space` or `L-Ctrl + Tab`) with automatic browser input suppression.

### 4. Segregated Emoji & Special Symbols Picker
* Independent tab panels separating graphic **Emojis** from technical **Symbols** (Greek letters, mathematical operators, and special shapes).

### 5. Convenient Utilities
* **Word Counter**: Real-time character/word tracker positioned at the bottom-left of the typing zone, with extra scroll bottom-padding to prevent layout overlap.
* **Copy/Clear Buttons**: Quick actions to copy typed text to clipboard or clear the input area.
* **Bilingual UI**: Full internationalization (i18n) support for both **繁體中文** and **English**.

---

## Tech Stack & Architecture

* **Frontend**: [Svelte 5](https://svelte.dev/) (utilizing reactive states)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styles**: [TailwindCSS](https://tailwindcss.com/) with responsive glassmorphism and modern dark-mode aesthetics
* **Bundler**: [Vite](https://vite.dev/)
* **Zhuyin Parser**: Custom state machine translating raw keyboard input to phonetics and candidate weights.

---

## Getting Started

### Prerequisites
Make sure you have Node.js and `pnpm` installed on your system.

### Installation
Clone the repository and install the dependencies:
```bash
pnpm install
```

### Run Locally (Development Server)
Launch the local hot-reloading development server:
```bash
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
To bundle the application for production deployment:
```bash
pnpm build
```
The production bundle will be built in the `dist/` directory.

### Code Checks & Linting
Validate TypeScript and Svelte components for correctness:
```bash
pnpm check
```

---

## License
This project is open-source and available under the [GNU General Public License v3.0](LICENSE).

---

## Appendix
* [Chinese Copywriting Guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)


