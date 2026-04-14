# CertiVerify AI

CertiVerify AI is a comprehensive Certificate Verification System with AI-powered analysis, automated generation, and secure administration. It leverages the power of Google's Gemini AI to streamline certificate management for educational institutions and certification bodies.

## 🌟 Key Features

*   **User Roles & Authentication**: Secure admin and student portals with dedicated access controls.
*   **Bulk Data Management**: Upload student data via Excel/CSV. Uses Gemini AI to automatically clean data, fix typos, and standardize names during upload.
*   **Automated Certificate Generation**: Instantly generate professional certificates with one click.
*   **Certificate Search & Retrieval**: Students and employers can verify certificates instantly using unique IDs.
*   **AI-Powered Image Verification**: Upload a photo of a physical certificate, and Gemini 3.1 Pro will extract details and verify them against the database using OCR.
*   **AI Assistant**: A built-in chat interface powered by Gemini Flash Lite and Gemini 3.1 Pro to answer questions about the verification process.
*   **Export Options**: Download certificates as high-quality PDFs or print them directly from the browser.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **AI Integration**: `@google/genai` SDK (Gemini 3.1 Pro & Gemini Flash Lite)
*   **Utilities**: `jspdf` & `html2canvas` (PDF generation), `xlsx` (Excel parsing), `motion` (Animations)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd certiverify-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 Usage Guide

### Admin Dashboard
1. Navigate to the Login page.
2. Select the **Admin** role and log in using the demo credentials:
   *   **Username**: `admin`
   *   **Password**: `admin`
3. From the dashboard, you can manually add students, import bulk data via CSV/Excel, and generate certificates.

### Verifying Certificates
1. Navigate to the **Verify Certificate** page from the home screen.
2. Enter a valid Certificate ID (e.g., `CERT-2024-001`) to view its details and authenticity status.

### AI Verification
1. Navigate to the **AI Intelligence Hub**.
2. **Image Verification**: Upload a scanned image of a certificate to automatically extract its details.
3. **AI Assistant**: Switch to the chat tab to ask questions about the system or verification processes. You can toggle "Thinking Mode" for complex reasoning tasks.

## 📄 License

This project is licensed under the MIT License.

