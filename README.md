# Portfolio Landing Page

A modern portfolio website built with Next.js 15, Supabase, and Tailwind CSS. Display your portfolio links with beautiful URL previews featuring automatic thumbnail, title, and description extraction.

## Features

- 🔗 Add portfolio links via admin interface
- 🖼️ Automatic URL preview generation with OG tags
- 📱 Fully responsive design
- ⚡ Built with Next.js 15 App Router
- 🗄️ Supabase for database management
- 🎨 Beautiful UI with Tailwind CSS

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new project at [Supabase](https://supabase.com)
   - Run the SQL commands in `supabase-schema.sql` to create the database schema
   - Get your project URL and anon key

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see your portfolio!

## Usage

### Adding Portfolio Links
1. Navigate to `/admin` or click the "Add Link" button
2. Enter the URL of your portfolio project
3. The system will automatically fetch preview information
4. Your link will appear on the main page as a beautiful card

### Database Schema
The app uses a simple `portfolio_links` table with:
- `id`: Primary key
- `url`: The portfolio URL
- `created_at`: Timestamp

## Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms
This is a standard Next.js app and can be deployed to any platform that supports Node.js.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Web Scraping**: Cheerio for OG tag extraction
- **Deployment**: Vercel (recommended)

## API Routes

### `/api/preview`
Fetches Open Graph metadata for URL previews.

**Query Parameters:**
- `url`: The URL to fetch preview data for

**Response:**
```json
{
  "title": "Page Title",
  "description": "Page Description",
  "image": "https://example.com/image.jpg",
  "url": "https://example.com"
}
```
