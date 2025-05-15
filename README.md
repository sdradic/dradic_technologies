# 🧩 Modular Portfolio Ecosystem – Master Plan

This document outlines the structure and development plan for a modular personal portfolio ecosystem, consisting of:

- A central portfolio site
- A blog system powered by Markdown
- Standalone project repositories
- An optional custom CMS system for blog management

---

## 🗂️ Repository Structure

| Repository          | Purpose                                   | Stack                        | Hosting              |
| ------------------- | ----------------------------------------- | ---------------------------- | -------------------- |
| `portfolio-site`    | Main site linking to all projects/blog    | React                        | Vercel / Netlify     |
| `blog-system`       | Markdown blog with backend + frontend     | FastAPI + React              | Render / Fly.io      |
| `cms-admin` (later) | Admin UI to manage blog posts dynamically | React + FastAPI + S3         | TBD                  |
| `project-*`         | Individual project apps/sites             | Custom (Python, React, etc.) | Netlify / Fly / etc. |

---

## ✅ Phase 1: Build `portfolio-site`

A simple, elegant React-based site that links out to all projects and the blog.

### Tech Stack:

- React (Vite or CRA)
- Static JSON or object for project metadata
- React Router (optional)
- Deployed via Vercel or Netlify
