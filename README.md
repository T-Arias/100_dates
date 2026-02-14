# 💝 100 Dates: A Couple's Adventure App

A mobile-first, interactive web application designed for couples to gamify their relationship. Spin the roulette to get a random date idea, complete the challenge together, and upload photos to build a shared digital scrapbook.

## ✨ Features

* **🎲 Interactive Roulette:** Spin the wheel to get a random, non-repeating date idea.
* **💑 Couple Pairing:** Secure session management using temporary invite codes to link both partners.
* **📸 Dual Photo Upload:** Capture the moment by taking photos directly from your mobile camera or uploading from the gallery (supports 2 photos per date).
* **🖼️ Shared Digital Album:** A beautiful, responsive Polaroid-style gallery with a lightbox view to look back on your completed dates.
* **💌 Custom Intro:** A tailored introductory date card to start the adventure with a special message.

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **Backend & Database:** Supabase (PostgreSQL, Authentication, Storage)

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) installed on your machine.
* A [Supabase](https://supabase.com/) account and project.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <your-project-folder>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

To run the app locally, execute:
```bash
npm run dev
```

## 📝 Author

**Tomas Arias**

## 📄 License

This project is licensed under the MIT License.