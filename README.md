# Zedacres Farm website

A responsive, dependency-free public website for Zedacres Farm, built with plain HTML, CSS and JavaScript. Open `index.html` in a browser to preview it or serve this directory with any static web server.

## Before publishing

- Confirmed farm location: Chipata, Eastern Province, Zambia. Phone and email have been supplied.
- Confirm training information before adding programme descriptions, dates or fees; none are assumed here.
- Gallery and feature images currently load illustrative stock photography from Unsplash. Replace the image URLs in `index.html` with farm-owned or approved images and update their alt text and captions. The current photos are not photographs of Zedacres Farm.
- The gallery includes fish farming, crops and training video placeholders. Add approved MP4 footage and set each video's `data-video-src` in `index.html` to its served URL or relative file path; the corresponding video play control will then become available.
- The floating "Ask Zedacres" assistant is a scripted, browser-only demo. It has no live AI connection and only answers using site details; extend `respond()` in `script.js` and the example prompts in `index.html` to change its demo interactions.

The site has no build step or package dependencies.
