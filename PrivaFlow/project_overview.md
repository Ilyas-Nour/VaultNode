# VaultNode: A Privacy-First, Edge-Computing Utility Suite

Built by **Ilyas NOUR**, VaultNode is a high-performance, full-stack web application designed as a "Swiss Army Knife" for file and media manipulation. The core philosophy of the project is **"Your Data Never Leaves Your Device"**, achieved through cutting-edge browser technologies.

---

## 🚀 1. The Core Vision
Most online utility tools (PDF converters, image background removers, etc.) require users to upload sensitive files to a remote server. VaultNode solves this privacy risk by executing 100% of the processing locally on the user's browser using **WebAssembly (WASM)** and **Web Crypto APIs**.

## 🛠️ 2. The Tech Stack
The project leverages the most modern and performant technologies available in the React ecosystem:

| Layer | Technologies Used |
| :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** & **React 19** |
| **Language** | **TypeScript** (Ensuring type safety and maintainable code) |
| **Styling** | **Tailwind CSS 4** (Modern utility-first styling) & **Shadcn UI** |
| **Animations** | **Framer Motion** (For a premium, high-intellect aesthetic) |
| **Processing** | **FFmpeg WASM**, **@imgly/background-removal**, **PDF-lib** |
| **Internationalization** | **next-intl** (Multi-language support: EN, FR, ES, AR) |

---

## 🎯 3. Key Functionalities
VaultNode is organized into specialized toolsets, each designed with a focus on speed and privacy:

### 📄 PDF Intelligence
*   **Merge & Split**: Instant manipulation of PDF structures.
*   **Unlock & Protect**: Managing PDF security permissions locally.
*   **Sign & Stamp**: Professional document workflows without cloud exposure.
*   **Conversion**: PDF to Word (Docx) and Image conversion using client-side rendering.

### 🖼️ Creative Media Engine
*   **AI Background Removal**: Isolates subjects from images using local AI inference.
*   **Image Optimization**: HEIC to JPG conversion and intelligent compression.
*   **Enhancer Tools**: Blur, Stamp, and Exif data cleaning for privacy.

### 🎥 Media Converter
*   **Video processing** powered by **FFmpeg** running in a browser sandbox, allowing for format conversion without a backend.

### 🔐 Security & Privacy Tools
*   **PII Redaction**: Intelligent tool to hide sensitive information.
*   **Encryption**: Secure text encryption using browser-native crypto modules.

---

## ⚙️ 4. How It Entirely Works (Under the Hood)

### A. The Browser-as-a-Server (WASM)
Instead of sending files to a backend, VaultNode loads heavy binary engines (like **FFmpeg** or **Machine Learning models**) into the browser via **WebAssembly**.
*   **Efficiency**: Processes files at near-native speeds.
*   **Privacy**: Files stay in the RAM of the user's computer; if they refresh the page, the data is gone.

### B. Scalable UI/UX Architecture
*   **Atomic Design**: Built with modular components (Shadcn/Radix UI) for high reusability.
*   **Immersive States**: Tools transition into "Immersive Modes" using Framer Motion to maximize focus during complex tasks like image refining.
*   **Responsive Scaling**: Custom logic ensures the interface remains premium across all viewports.

### C. Global Reach (I18n)
The app uses **Locale-based Routing**. Every string is externalized into JSON translation files, allowing the project to scale to new markets (Middle East with RTL/AR support, Europe with FR/ES) without code changes.

---

## 🌟 5. Why This Project Matters for an Internship
VaultNode demonstrates a high level of technical proficiency across the "Full-Stack" spectrum, even though it focuses on Client-Side execution. It showcases:
1.  **System Design**: Knowledge of memory management and browser limitations.
2.  **Product Thinking**: Prioritizing user privacy and security.
3.  **Modern Engineering**: Mastery of the latest React and NextJS paradigms.
4.  **Attention to Detail**: premium animations and a polished design system that "wows" users.

---

> [!TIP]
> **Key Interview Phrase**: "VaultNode isn't just a website; it's a high-performance local application distributed through the web. It pushes the boundaries of what browsers can do by moving computation from the cloud to the edge."
