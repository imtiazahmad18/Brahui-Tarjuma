# Brahui Tarjuma (براہوئی ترجمہ) — Complete Setup & Publishing Guide

Welcome to **Brahui Tarjuma**! This guide is written in clear, simple language assuming no prior coding experience. Follow these steps to set up your database, launch your website for free on Vercel, and publish your first Brahui translations.

---

## Table of Contents
1. [Creating your Free Supabase Database](#1-creating-your-free-supabase-database)
2. [Running the Database Setup (SQL)](#2-running-the-database-setup-sql)
3. [Setting Up Storage Buckets (Covers & PDFs)](#3-setting-up-storage-buckets-covers--pdfs)
4. [Creating Your Admin Account](#4-creating-your-admin-account)
5. [Configuring Environment Variables](#5-configuring-environment-variables)
6. [Testing Locally on Your Computer](#6-testing-locally-on-your-computer)
7. [Publishing Code to GitHub](#7-publishing-code-to-github)
8. [Deploying Free on Vercel](#8-deploying-free-on-vercel)
9. [Connecting a Custom Domain](#9-connecting-a-custom-domain)
10. [Submitting Your Sitemap to Google Search Console](#10-submitting-your-sitemap-to-google-search-console)
11. [How to Publish a New Article (Admin Guide)](#11-how-to-publish-a-new-article-admin-guide)

---

## 1. Creating your Free Supabase Database

Supabase provides your free PostgreSQL database, image/PDF storage, and secure authentication.

1. Go to [supabase.com](https://supabase.com) and click **"Start your project"**.
2. Sign in or create a free account (you can sign in with your GitHub account or email).
3. Click **"New Project"**.
4. Choose an organization (or create one), then enter:
   - **Name**: `Brahui Tarjuma`
   - **Database Password**: Choose a strong password and save it somewhere safe.
   - **Region**: Choose the closest region to your primary audience (e.g., *South Asia / Singapore / Frankfurt*).
   - **Pricing Plan**: Select **Free tier**.
5. Click **"Create new project"** and wait about 1–2 minutes for the database to finish setting up.

---

## 2. Running the Database Setup (SQL)

Once your Supabase project dashboard loads:

1. Look at the left sidebar menu and click **"SQL Editor"** (icon looks like a terminal/document with `_>`).
2. Click **"New query"** (or the **"+"** button).
3. Open the file called `supabase-schema.sql` included in this project folder.
4. Copy the entire contents of `supabase-schema.sql` and paste it into the Supabase SQL Editor box.
5. Click the green **"Run"** button in the bottom right corner (or press `Ctrl + Enter`).
6. You will see a green message saying **"Success. No rows returned"**.
   - This automatically creates your `articles`, `chapters`, `writers`, and `static_pages` tables.
   - It sets up security policies (Row Level Security) so the public can only read published articles.
   - It inserts the 3 initial sample translations and authors (Manto, Faiz, Borges, Hemingway).

---

## 3. Setting Up Storage Buckets (Covers & PDFs)

Your database script has already configured the buckets, but let's confirm them:

1. Click **"Storage"** in the left sidebar of Supabase.
2. Confirm you see two public buckets:
   - `covers` (for article cover images)
   - `pdfs` (for novel/article downloadable PDFs)
3. If they are not visible, click **"New bucket"**, name it `covers`, toggle **"Public bucket"** to **ON**, and save. Do the same for `pdfs`.

---

## 4. Creating Your Admin Account

Only **one owner/admin account** will have access to publish or edit translations. Public signups are blocked.

1. In Supabase, click **"Authentication"** on the left menu (person icon).
2. Go to the **"Users"** tab.
3. Click **"Add user"** > **"Create user"**.
4. Enter:
   - **Email**: Enter your personal email address (e.g., `admin@brahuitarjuma.org` or your Gmail).
   - **Password**: Create a secure password for your admin login.
   - Check **"Auto Confirm User?"** to **YES**.
5. Click **"Create user"**.
6. Next, disable public signups so nobody else can register:
   - Go to **Authentication** > **Providers** > **Email**.
   - Turn OFF **"Enable signup"** (keep only Sign in enabled).
   - Click **"Save"**.

---

## 5. Configuring Environment Variables

1. In Supabase, go to **"Project Settings"** (gear icon at the bottom of the left sidebar).
2. Click **"API"**.
3. Copy these two values:
   - **Project URL** (e.g. `https://xyzabcdefg.supabase.co`)
   - **Project API Keys** > `anon` `public` (a long key starting with `eyJ...`)
4. In your project folder on your computer, open the file `.env.local` (or copy `.env.example` to `.env.local`).
5. Fill in the keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

---

## 6. Testing Locally on Your Computer

1. Open your terminal in the `Brahui_Tarjuma` folder.
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and visit:
   ```
   http://localhost:3000
   ```
4. You will see:
   - The homepage with the official Brahui Tarjuma seal logo.
   - The articles displayed in beautiful **Jameel Noori Nastaliq** calligraphy.
   - The Dark / Light mode toggle in the top right.
   - Visiting `http://localhost:3000/admin` lets you sign in with your email and password.

---

## 7. Publishing Code to GitHub

1. Go to [github.com](https://github.com) and log in.
2. Click the **"+"** icon in the top right and select **"New repository"**.
3. Name it `brahui-tarjuma`.
4. Leave it Public or Private (either is fine) and click **"Create repository"**.
5. In your local terminal, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Brahui Tarjuma website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/brahui-tarjuma.git
   git push -u origin main
   ```

---

## 8. Deploying Free on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **"Add New..."** > **"Project"**.
3. Select your `brahui-tarjuma` repository and click **"Import"**.
4. Under **"Environment Variables"**, add the two Supabase variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: paste your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: paste your Supabase anon key
   - `NEXT_PUBLIC_SITE_URL`: paste your live domain (e.g., `https://brahuitarjuma.org` or `https://brahui-tarjuma.vercel.app`)
5. Click **"Deploy"**.
6. In about 60 seconds, your site is live across the world!

---

## 9. Connecting a Custom Domain

1. In your Vercel project dashboard, click **"Settings"** > **"Domains"**.
2. Type your domain name (e.g., `brahuitarjuma.org` or `brahuitarjuma.com`) and click **"Add"**.
3. Vercel will show you the exact DNS records (usually an `A` record pointing to `76.76.21.21` or a `CNAME` record).
4. Log into the registrar where you bought your domain (Namecheap, GoDaddy, Cloudflare, etc.).
5. Add the DNS records shown by Vercel.
6. Once verified (usually 5–15 minutes), Vercel automatically activates free SSL / HTTPS encryption!

---

## 10. Submitting Your Sitemap to Google Search Console

This ensures Google quickly indexes all your Brahui translations:

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Add your website property (e.g., `https://brahuitarjuma.org`).
3. Verify ownership (the easiest method on Vercel is via DNS TXT record or HTML tag).
4. Once verified, click **"Sitemaps"** in the left sidebar menu.
5. In the "Add a new sitemap" box, type:
   ```
   sitemap.xml
   ```
6. Click **"Submit"**.
7. Google will status report: **"Success"**. Googlebot will crawl your published Brahui articles and display them in Google Search!

---

## 11. How to Publish a New Article (Admin Guide)

Whenever you receive a new translation from a translator:

1. Visit your website's admin page: `https://yourdomain.com/admin`.
2. Sign in with your email and password.
3. Click the **"New Translation"** button (or click the **"New Article Form"** tab).
4. Fill in the fields:
   - **Title (Brahui)**: Paste the translation title in Urdu script. (e.g., `ٹوبہ ٹیک سنگھ`).
   - **Subtitle (Brahui)**: Optional subtitle or description.
   - **URL Slug**: Automatically generated in English/Latin letters (e.g., `toba-tek-singh`). You can edit it if you want.
   - **Category**: Select from the 5 standard categories:
     - `Fiction` (Short stories, novels)
     - `Poetry`
     - `Criticism`
     - `Research`
     - `Articles` (Essays)
   - **Original Writer Name**: The original author (e.g., `Saadat Hasan Manto` or `سعادت حسن منٹو`).
   - **Original Title**: The title in the original language (e.g., `Toba Tek Singh`).
   - **Translator Name**: Name of the translator in Brahui or English (e.g., `عبدالرزاق ساسولی`).
   - **Cover Image**: You can upload an image from your computer (auto-stored in Supabase Storage) or leave `/brahui-tarjuma.jpeg` to use the official circular emblem seal!
   - **Brahui Translation Body**: Paste the complete Brahui text. Paragraph breaks and poem line breaks are preserved exactly as pasted. Look at the **Live Nastaliq Preview** on the right side to see how it renders!
   - **Original Text (Optional)**: If you have the original source text (Urdu, English, Arabic, etc.), paste it in the Original Text box, choose the direction (`LTR` for English, `RTL` for Urdu/Arabic), and enter the citation source.
   - **For Novels**: Click **"Add Chapter"** to add Chapter 1, Chapter 2, etc., and optionally paste a PDF download link.
   - **SEO Meta Description**: Click **"Auto-fill from body"** to generate a 150-character summary for Google.
5. Click **"Publish Translation"**.
6. The article is instantly live on the website, featured on the homepage, listed under its category, attributed to the author, and included in the sitemap!
