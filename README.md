# Zedacres Farm website

A responsive public website for Zedacres Farm, built with plain HTML, CSS and JavaScript. Open `index.html` in a browser to preview it or serve this directory with any static web server. Account authentication loads the Supabase JavaScript client at runtime when configured.

## Before publishing

- Confirmed farm location: Chipata, Eastern Province, Zambia. Phone and email have been supplied.
- Confirm training information before adding programme descriptions, dates or fees; none are assumed here.
- Gallery and feature images currently load illustrative stock photography from Unsplash. Replace the image URLs in `index.html` with farm-owned or approved images and update their alt text and captions. The current photos are not photographs of Zedacres Farm.
- The gallery includes fish farming, crops and training video placeholders. Add approved MP4 footage and set each video's `data-video-src` in `index.html` to its served URL or relative file path; the corresponding video play control will then become available.
- The floating "Ask Zedacres" assistant is a scripted, browser-only demo. It has no live AI connection and only answers using site details; extend `respond()` in `script.js` and the example prompts in `index.html` to change its demo interactions.
- The assistant also provides a three-question site-facts quiz and prepared WhatsApp enquiry links. The WhatsApp handoff opens a visitor-reviewed message to the supplied number; confirm the number is registered on WhatsApp before promoting this feature.
- The Join Us section supports real email/password accounts through Supabase Auth. Accounts stay disabled until the farm owner creates a Supabase project and configures `auth-config.js`.
- To enable accounts:
  1. Create a Supabase project and enable email/password sign-in.
  2. Copy the project URL and publishable key (or legacy anon key) into `url` and `anonKey` in `auth-config.js`. These public client values are intended to be visible in the site. Never use a `service_role` key or any other secret.
  3. In Supabase Auth URL settings, add the deployed HTTPS site URL to the allowed redirect URLs. Configure the email-confirmation and password-reset templates to link back to the site.
  4. Deploy the site over HTTPS. Sign-up sends an email confirmation when enabled; visitors can choose a farming interest, sign in, request a password reset, and sign out. Name and farming interest are stored as Supabase user metadata.
- Account forms send email/password to Supabase only when a valid HTTPS project URL and public key are configured. Without them, the controls remain disabled and the page says accounts are not configured. The page does not save passwords; Supabase Auth persists the signed-in session in the visitor's browser using its client SDK.

The site has no build step. Supabase authentication requires an internet connection to load the Supabase JavaScript client and contact the configured project.

## Deploy to Netlify

This repository includes `netlify.toml` for a no-build static deployment. To publish it, sign in to Netlify, choose **Add new site** > **Import an existing project**, connect the GitHub repository, and select the `main` branch. Keep the build command empty; Netlify reads the publish directory (`.`) from the configuration. Deploy the site over HTTPS.

After the first deploy, add the production site URL to the Supabase project's allowed redirect URLs before enabling account sign-up, confirmation, or password recovery. To deploy without linking Git, upload the site files in the Netlify manual deploy flow. A live deployment must be created from an authenticated Netlify account.
