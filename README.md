# Image Converter

A fast, clean, and anonymous web application to convert common image formats in seconds. Built strictly according to the product specification with **Next.js App Router (JavaScript)** on the frontend and **Node.js / Express / Sharp** on the backend.

## Features
- **Anonymous & Private**: No sign-in, no database, no persistent storage. Converted files are processed in-memory / temporary storage and immediately served.
- **Supported Formats**:
  - Input: JPG/JPEG, JFIF, PNG, WebP, AVIF, static GIF.
  - Output: JPG, PNG, WebP, AVIF, GIF.
- **Conversion Options**:
  - Quality setting for lossy formats (default 85).
  - Optional resize (width / height) with aspect-ratio preservation.
  - Smart transparency flattening (defaults to clean white background when converting transparent images to JPG).
  - Privacy-first metadata stripping (with opt-in preservation).
- **Single & Batch Processing**:
  - Single file: Direct high-speed download with metadata response headers.
  - Batch conversion: Multi-file conversion packaged into a `.zip` archive.
- **Safety & Robustness**:
  - Authoritative server-side file inspection with Sharp (rejects disguised executables, corrupt files, and unsupported animated formats).
  - Configurable limits on file sizes, batch counts, and megapixel bounds.
  - Rate limiting & Helmet security headers.

## Tech Stack
- **Frontend**: Next.js 14/15 App Router (JavaScript / JSX), Tailwind CSS, Lucide React.
- **Backend**: Express.js (JavaScript), Sharp, Multer, Archiver, Helmet, Express-Rate-Limit, CORS.

## Project Structure
```text
image-converter/
├── client/          # Next.js App Router frontend
├── server/          # Express.js image processing backend
├── .env.example     # Environment variable reference
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js >= 20.9 (Node.js 22+ recommended)
- npm >= 10

### 1. Server Setup
```bash
cd server
npm install
npm run dev
```
Server runs at `http://localhost:5000`.

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```
Client runs at `http://localhost:3000`.
