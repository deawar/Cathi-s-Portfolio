# Going Live — cathiwarren.art

## Step 1: Create a Sanity Account & Project

1. Go to **https://sanity.io** and create a free account
2. Click **"Create new project"**
3. Name it: `Cathi Warren Art`
4. Choose dataset: `production`
5. Copy your **Project ID** (looks like: `abc1def2`)

## Step 2: Create a Resend Account (for the contact form)

1. Go to **https://resend.com** and create a free account
2. Verify your domain OR use their test sender for now
3. Go to **API Keys** → Create a new key
4. Copy the key (starts with `re_...`)

## Step 3: Set Up Your Environment File

In the project folder, find the file `.env.local.example`.
Make a copy of it named `.env.local` and fill in your values:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=paste-your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=           ← leave blank for now, add later if needed
RESEND_API_KEY=re_paste-your-key-here
CONTACT_EMAIL=your-real-email@example.com
NEXT_PUBLIC_SITE_URL=https://cathiwarren.art
```

Save the file. Do NOT share this file or commit it to git — it contains private keys.

## Step 4: Test Locally

Open a terminal in the project folder and run:

```
npm run dev
```

Visit **http://localhost:3000** in your browser.
The site should load. Go to **http://localhost:3000/studio** to open the admin panel.

## Step 5: Upload Your First Artwork (Test)

1. Go to http://localhost:3000/studio
2. Click **Artwork** → **+ Create**
3. Upload a photo, fill in the title and type (Painting)
4. Toggle **"Use as Hero Slideshow Image"** ON
5. Toggle **"Featured on Homepage"** ON
6. Click **Publish**
7. Refresh http://localhost:3000 — your painting should appear

## Step 6: Deploy to Vercel

1. Go to **https://vercel.com** and create a free account
2. Click **"Add New Project"** → **"Import Git Repository"**
   - If your project isn't on GitHub yet, push it first:
     ```
     git add .
     git commit -m "initial build"
     git remote add origin https://github.com/YOUR-USERNAME/cathiwarren-art.git
     git push -u origin main
     ```
3. Select your repository → Vercel auto-detects Next.js
4. Under **"Environment Variables"**, add the same keys from your `.env.local` file
5. Click **Deploy**
6. Vercel gives you a test URL like `cathiwarren-art.vercel.app` — visit it to confirm it works

## Step 7: Point Your Domain to Vercel

1. In Vercel, go to your project → **Settings** → **Domains**
2. Add: `cathiwarren.art` and `www.cathiwarren.art`
3. Vercel will show you DNS records to add — copy them
4. Log in to wherever you bought `cathiwarren.art` (GoDaddy, Namecheap, etc.)
5. Go to DNS settings and add the records Vercel provided
6. Wait 10–60 minutes for DNS to propagate
7. Vercel automatically sets up SSL (the padlock) for free

## Step 8: Configure Sanity CORS (Required for Studio)

Once your domain is live, tell Sanity to allow requests from it:

1. Go to **https://sanity.io/manage** → your project
2. Click **API** → **CORS Origins**
3. Add: `https://cathiwarren.art`
4. Add: `https://www.cathiwarren.art`
5. Check **"Allow credentials"** for both
6. Save

## You're Live! Ongoing Upkeep

| Task | How |
|------|-----|
| Upload a new painting | Go to `/studio` → Artwork → Create |
| Upload a sculpture | Same — choose "Sculpture" as type |
| Write a blog post | `/studio` → Blog Post → Create |
| Edit existing content | `/studio` → click the item → edit → Publish |
| Change who gets contact emails | Edit `CONTACT_EMAIL` in Vercel environment variables |

## Need Help?

- Sanity docs: https://www.sanity.io/docs
- Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs
- Resend docs: https://resend.com/docs
