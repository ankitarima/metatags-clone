# MetaTags Pro

**MetaTags Pro** is a modern, high-performance, and responsive SEO tooling application designed to give developers, marketers, and site owners precise, real-time control over their metadata. Stop guessing how your links will unfurl across the web and preview them accurately before shipping.

Built with **React** (Vite environment), **TypeScript**, and **Tailwind CSS** (utilizing a unified Shadcn-inspired clean architecture).

## 🚀 Key Features

- **Live Multi-Platform Previews**: Visualize your meta properties exactly as they will appear natively on Google Search, Twitter/X, Facebook, LinkedIn, and Discord.
- **Smart DOM Parser Engine**: Instantly scrapes live website targets natively. It defaults to an ultra-fast local/production PHP proxy logic (`api/fetch.php`) to bypass strict CORS blocks, and gracefully falls back to public proxies if a backend isn't mounted.
- **Local Image Uploads**: Upload custom local image files directly into the UI via an integrated `FileReader` base64 converter to preview brand assets *before* ever uploading them to a public server.
- **AI-Powered "Magic" Utilities**: Generate highly optimal, simulated SEO descriptions and title variants instantly on demand.
- **Intelligent Export Variations**: Seamlessly push your results into clipboard-ready snippets in 3 advanced syntaxes:
  - Standard Raw `HTML`
  - Next.js 13+ (App Router) `Metadata` Objects
  - `react-helmet` Components
- **Persistent History**: Integrated frontend `localStorage` architecture saves the metadata mappings of the 5 most recent live endpoints you've tested for rapid debugging over multiple sessions.
- **Dark/Light Mode**: Full comprehensive modern UI theme toggling.

## 🛠 Tech Stack

- **Frontend Core**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v3
- **Icons**: `lucide-react`
- **Custom UI**: Autonomous generic `Card`, `Label`, `Button`, `Input`, and `Textarea` wrapper system.
- **Proxy Server Backend (API)**: Native PHP cURL server to safely bridge external origin traffic.

## 📦 Local Installation & Getting Started

1. **Clone the project:**
   ```bash
   git clone https://github.com/yourusername/metatags-clone.git
   cd metatags-clone
   ```

2. **Install all NPM dependencies:**
   ```bash
   npm install
   ```

3. **Start the React Frontend:**
   ```bash
   npm run dev
   ```

4. **Start the Core API Proxy (Backend):**
   To maximize fetch speeds securely and bypass public rate limits efficiently, run your ultra-fast native PHP proxy locally in a separate parallel terminal tab:
   ```bash
   npm run api
   ```
   *(Note: This fires `php -S 127.0.0.1:4000 -t api` and thus requires PHP to be installed locally).*

## ⚙️ Application Architecture

The application has been heavily refactored from a monolithic base into a highly scalable, strictly typed modular framework:

- `src/App.tsx`: Central state management orchestrator locking features together via prop-drilling depth map limits dynamically handling API failovers. 
- `api/fetch.php`: Local cross-origin routing and HTML cURL generator. Note that in production environments, the fetch URL smoothly detects `localhost` usage and dynamically switches exactly to your defined `metatags.akoladigital.com/api/fetch.php` endpoint.
- `src/components/ui/`: Atomic design primitives locking styles globally across the app block components.
- `src/components/PreviewSection.tsx`: Houses the exact 1:1 markup CSS structures required to visually recreate social platforms natively. 
- `src/components/CodeExporter.tsx`: Controls the animated floating modal overlay that bridges abstract UI states to final programmatic codebase formats.
