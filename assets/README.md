# Assets folder

Drop your real files in here and update the links in `index.html` to match:

- `resume.pdf` — your CV. The hero button already links to `assets/resume.pdf`.
- `headshot.jpg` — replace the SVG placeholder circle in the About section (`#about`)
  with `<img src="assets/headshot.jpg" alt="[Your Name]">`.
- Project photos/screenshots — replace the inline SVG thumbnails in the Projects
  cards (`.card__thumb`) the same way.
- Certificates, transcripts, award letters — link each Artefacts card (`#artefacts`)
  to the matching PDF, e.g. `href="assets/transcript.pdf"`.

Keep file names lowercase with no spaces (use hyphens) so links don't break when
deployed to Azure.
