# BioGenAI Solutions Website Design

A biotech company specialized in developing advanced, scalable Artificial Intelligence and Bioinformatics solutions for precision medicine and healthcare innovation.

---

## Design System & Styling Guidelines

### Typography
* **Headings (Big Font):** Arial
* **Body / Content (Small Font):** Arial Narrow

### Color Palette
* **Main Color:** `#747F8D` (Slate Gray)
  * *Usage:* Primary text, subtle backgrounds, borders, secondary text, and muted icons.
* **Secondary Colors (Derived from Main Color):**
  * *Lighter Accent:* `#9CA6B1` (for disabled states, light borders, or secondary buttons)
  * *Darker Accent:* `#4B535C` (for hover states, strong text, or active elements)
* **Backgrounds:** White (`#FFFFFF`) or very light gray (`#F8F9FA`) to ensure the main color and gradient read clearly.

### Brand Gradient (Logo & Highlights)
* **Gradient Value:** `linear-gradient(90deg, #2D7FF9 0%, #3658F5 25%, #A83BF7 50%, #FF3B8B 75%, #FF8A00 100%)`
* **Usage:** 
  * Primary Call-to-Action (CTA) buttons (e.g., the "Submit" button in the contact form).
  * Hover effects on primary navbar links.
  * Decorative borders, section separators, or active state highlights to create a dynamic and premium look.
  * Key icons or visual accents.

---

## Top Navbar

1. **Home** *(Content TBD)*
2. **Solutions** *(Content TBD)*
3. **Services** *(Content TBD)*
4. **Research**
   * List of Medium.com papers:
     * [Artificial Intelligence Applications in Biostatistics, Bioinformatics and Computational Biology](https://ernest-bonat.medium.com/machine-learning-applications-in-genomics-life-sciences-by-ernest-bonat-ph-d-83598e67ccbc) by Ernest Bonat, Ph.D.
5. **News** *(Content TBD)*
6. **Contact: Send Us a Message**
   * **Instructions:** Fill out the form below and our team will get back to you within 24 hours.
   * **Required Fields:** First Name, Last Name, Email, Job Title, Company, Interested in (dropdown), Comments.
   * **Security:** Add "Protected by reCAPTCHA"
   * **Disclaimer:**
     > At BioGenAI Solutions, we value your trust and are committed to maintaining the confidentiality and security of your information. Any information submitted through our website is used exclusively to respond to your requests, provide professional consulting services, and keep you informed about relevant developments in Artificial Intelligence, Biostatistics, Bioinformatics, Precision Medicine, Healthcare Technology, and Life Sciences. You may unsubscribe from communications at any time. Please review our Privacy Policy to learn more about our data protection and privacy practices.
   * **Action:** "Submit" button (Apply Brand Gradient here) - Emails sent to: `ernest.bonat@biogenaisolutions.com`
7. **About** *(Content TBD)*
8. **Vision**
   * To revolutionize healthcare and life science by delivering intelligent, personalized GenAI solutions that empower life-changing decisions.
9. **Mission**
   * Bridging precision medicine and responsible GenAI solutions to deliver personalized healthcare and advance life sciences.
10. **Philosophy**
    * We build human-first, ethically grounded GenAI that personalizes care, empowers decisions, and fosters collaboration to transform healthcare and life sciences together.
11. **Language Translation Icon with Menu**
    * English
    * Spanish
    * Arabic
    * French
    * German

---

## Company Overview

BioGenAI Solutions is a specialized Artificial Intelligence, Bioinformatics, and Healthcare Technology consulting firm dedicated to transforming healthcare and life sciences through responsible, human-centered innovation.

Led by Ernest Bonat, Ph.D., a Data Science Professor, Senior AI Engineer, Bioinformatics Scientist, Data Engineer, and Healthcare Integration Specialist with over 25 years of software engineering experience and more than 8 years developing advanced Machine Learning, Generative AI, Agentic AI, Biostatistics, Bioinformatics, and Computational Biology solutions. BioGenAI delivers cutting-edge technologies that solve complex scientific and business challenges. 

We help healthcare providers, biotechnology companies, pharmaceutical organizations, research institutions, and enterprises harness the power of Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Agentic AI systems, Machine Learning, Deep Learning, Data Engineering, Bioinformatics, Genomics, and HL7 healthcare interoperability to accelerate discovery, improve patient outcomes, optimize operations, and unlock actionable insights from complex data.

Our mission is to bridge precision medicine and responsible AI by delivering intelligent, scalable, and personalized solutions that empower life-changing decisions and advance the future of healthcare and life sciences.

---

## Footer (Bottom Menu)

1. Legal
2. Privacy Policy
3. Terms of Service

---

## Architecture & Content Management

To empower non-technical clients to update the website without coding or using an IDE, the website will use a **Jamstack architecture** with a Git-based headless CMS.

### Selected Approach: Decap CMS + Next.js/Astro + Netlify

* **Frontend Framework:** Next.js or Astro (Static Site Generation).
* **Hosting:** Netlify (or Vercel).
* **Content Management:** Decap CMS (formerly Netlify CMS).

### How it Works for the Client:
1. The client logs into a visual admin dashboard on the live site (e.g., `yourwebsite.com/admin`).
2. They use a simple, rich-text editor to update text, add images, or publish new news articles.
3. Clicking "Publish" automatically saves their changes as Markdown files directly into the project's GitHub repository.
4. The static host detects the new commit, rebuilds the site, and deploys the updated content live within minutes.

### Benefits:
* Completely free and self-contained (no third-party CMS database subscriptions needed).
* Content is safely version-controlled in Git.
* Zero coding knowledge required for the client to manage and scale the site content.