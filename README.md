# Image Converter

A fast, clean, anonymous image-conversion web application built with **Next.js App Router (JavaScript/JSX)** and an **Express.js + Sharp** backend.

---

## 🚀 Key Features

* **Anonymous & Private**: No sign-in, login, accounts, database, or persistent storage. Uploaded and converted files are processed in memory / temporary storage and immediately streamed back.
* **Supported Formats**:
  * **Input**: JPG, JPEG, JFIF, PNG, WebP, AVIF, static GIF.
  * **Output**: JPG, PNG, WebP, AVIF, GIF.
  * **Animated Rejection**: Explicitly rejects animated GIFs/WebPs with friendly, clear error messages to prevent silent frame loss.
* **Smart Image Processing (via Sharp)**:
  * Automatic EXIF orientation normalization (`.rotate()`).
  * Privacy-first metadata stripping (with opt-in toggle to preserve EXIF).
  * Transparency preservation for alpha-capable targets (PNG $\rightarrow$ WebP/AVIF).
  * Alpha flattening to configurable background (default white `#ffffff`) when converting transparent images to JPEG.
  * Optional width/height resizing with aspect ratio preservation.
* **Single & Batch Conversions**:
  * **Single file**: Direct binary download with informative headers (`X-Original-Size`, `X-Output-Size`, `X-Output-Width`, `X-Output-Height`, `X-Output-Format`).
  * **Batch conversion**: Converts up to 20 images with bounded concurrency and packages them into a `.zip` archive.
* **Modern & Accessible UI**:
  * Drag-and-drop zone with keyboard accessibility.
  * Live image previews, detected dimensions, and format tags.
  * Size savings statistics (e.g. `Saved: 2.1 MB (65%)` or `Output is larger by X%`).
  * Advanced settings panel (collapsed by default).
  * Responsive, mobile-first design.
* **Hardened Security**:
  * Helmet security headers, CORS origin restrictions, and rate limiting (`express-rate-limit`).
  * Multer limit enforcement for file size, counts, and parts.
  * Authoritative server-side Sharp decoding (rejects fake extensions and corrupted binaries).

---

## 🛠️ Architecture & Tech Stack

```text
image-converter/
├── client/                     # Next.js App Router Frontend (JavaScript/JSX)
│   ├── app/
│   │   ├── layout.js           # Root layout & SEO metadata
│   │   ├── page.js             # Single-page converter application
│   │   └── globals.css         # Tailwind styles & theme
│   ├── components/
│   │   ├── Header.jsx          # Brand & utility links
│   │   ├── Hero.jsx            # Value proposition
│   │   ├── ConverterWorkspace.jsx # Central state & conversion coordinator
│   │   ├── UploadZone.jsx      # Drag-and-drop & file picker
│   │   ├── FileList.jsx        # File items container
│   │   ├── FileCard.jsx        # Per-file thumbnail, status, selector, & remove
│   │   ├── FormatSelector.jsx  # Target format selector
│   │   ├── AdvancedOptions.jsx # Quality slider, resize, background, metadata
│   │   ├── ProgressBar.jsx     # Upload / conversion progress indicator
│   │   ├── ResultCard.jsx      # Single conversion result & savings
│   │   ├── BatchResultPanel.jsx# Batch ZIP download & stats
│   │   ├── SupportedFormats.jsx# Compatibility matrix
│   │   ├── HowItWorks.jsx      # 3-step usage guide
│   │   ├── PrivacyNote.jsx     # Privacy architecture notice
│   │   ├── Footer.jsx
│   │   └── ui/                 # Reusable Button, Card, Select, Slider
│   ├── lib/
│   │   ├── api.js              # Fetch client with error handling
│   │   ├── formats.js          # Client-side format definitions
│   │   └── validation.js       # File count/size/savings helpers
│   └── package.json
│
├── server/                     # Express.js Conversion Backend
│   ├── src/
│   │   ├── app.js              # Express app configuration & middlewares
│   │   ├── server.js           # HTTP server entrypoint & shutdown hooks
│   │   ├── config/env.js       # Environment configuration & limits
│   │   ├── controllers/        # Request handling & HTTP response headers
│   │   ├── middleware/         # Multer, validation, rate limiting, error handling
│   │   ├── routes/             # /api/health and /api/v1/convert routes
│   │   ├── services/           # Sharp pipeline, metadata inspection, batch ZIP
│   │   └── utils/              # Cleanups, filenames, format utilities
│   ├── tests/                  # Unit, fixture matrix, and API integration tests
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Client (`client/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:3000
MAX_FILE_SIZE_BYTES=15728640          # 15 MB
MAX_FILES_PER_BATCH=20                # 20 files
MAX_BATCH_SIZE_BYTES=104857600        # 100 MB
MAX_IMAGE_PIXELS=100000000            # 100 MP
RATE_LIMIT_WINDOW_MS=900000           # 15 minutes
RATE_LIMIT_MAX_REQUESTS=30            # 30 requests / window
```

---

## 🚦 Getting Started

### Prerequisites
* Node.js $\ge$ 20.9 (Tested on Node.js 22+)
* npm $\ge$ 10

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
```
The server will start at `http://localhost:5000`.

### 2. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
The client will start at `http://localhost:3000`.

---

## 🧪 Testing

The backend includes a comprehensive automated test suite covering:
* Unit tests for format normalization, MIME types, and filename sanitization.
* Mandatory conversion fixture matrix (`JPG -> PNG`, `JPG -> WebP`, `JFIF -> PNG`, `transparent PNG -> JPG` with alpha flattening, `transparent PNG -> WebP` with alpha preservation, `AVIF -> PNG`, static `GIF -> PNG`, animated GIF rejection, corrupt file rejection, and resize aspect ratio).
* API integration tests for `/api/health`, `/api/v1/convert`, and `/api/v1/convert/batch`.
* Security and limit tests for file size limits, batch limits, and option validation.

Run the tests with:
```bash
npm --prefix server test
```

---

## 📡 API Contract

### Health Check
* **`GET /api/health`**
  * Status: `200 OK`
  * Response: `{ "status": "ok" }`

### Single Conversion
* **`POST /api/v1/convert`**
  * **Content-Type**: `multipart/form-data`
  * **Fields**:
    * `file`: image binary (required)
    * `outputFormat`: `"png"` | `"jpg"` | `"webp"` | `"avif"` | `"gif"` (required)
    * `quality`: `"1"` - `"100"` (optional, default 85)
    * `width`: positive integer (optional)
    * `height`: positive integer (optional)
    * `keepAspectRatio`: `"true"` | `"false"` (optional, default true)
    * `background`: hex color string, e.g. `"#ffffff"` (optional)
    * `preserveMetadata`: `"true"` | `"false"` (optional, default false)
  * **Response**:
    * Status: `200 OK`
    * Direct binary image stream with headers:
      * `Content-Type: image/<format>`
      * `Content-Disposition: attachment; filename="<sanitized_name>.<format>"`
      * `X-Original-Size: <bytes>`
      * `X-Output-Size: <bytes>`
      * `X-Output-Width: <px>`
      * `X-Output-Height: <px>`
      * `X-Output-Format: <format>`

### Batch Conversion
* **`POST /api/v1/convert/batch`**
  * **Content-Type**: `multipart/form-data`
  * **Fields**: `files` (array of image binaries), `outputFormat`, and optional conversion settings.
  * **Response**:
    * Status: `200 OK`
    * `Content-Type: application/zip`
    * `Content-Disposition: attachment; filename="converted-images.zip"`
    * `X-Total-Files: <number>`
    * `X-Successful-Files: <number>`
    * `X-Failed-Files: <number>`

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "This file exceeds the 15 MB upload limit.",
    "details": {
      "maxBytes": 15728640
    }
  }
}
```
