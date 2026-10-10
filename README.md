# FireNav project homepage

GitHub Pages address after deployment: https://9thhh.github.io/FireNav/

A responsive academic website for **FireNav: Decision-Oriented Reconstruction Evidence Routing for Vision-Language Navigation in Indoor Fire Environments**.

## Preview and update

Run `python3 -m http.server 8766` in this directory and open http://localhost:8766.
GitHub Pages serves the repository root from `main`. No build step is needed.
The distribution keeps media next to `index.html`, with relative paths that work on project Pages URLs.

- Layout and copy: `index.html`
- Responsive styling: `styles.css`
- Camera views and CE/PE results: `script.js`
- Figures: `benchmark.webp`, `method.webp`, `comparison.webp`
- Videos: H.264 MP4 files; poster images share their names with a `.jpg` extension.

## Content provenance

Text, statistics, and results follow the supplied manuscript source.
The downloadable PDF is the existing September 23, 2026 manuscript, without an arXiv conversion.
The LaTeX archive contains the specified source export and figures, with paths matching the source.
The website does not independently validate experiment provenance.

All demonstrations come from the supplied Demo directory and depict simulation.
Browser encodings preserve duration, use 20 fps, H.264/yuv420p, and fast-start MP4.
The overview retains its original editorial speed and captions.
Comparison videos execute independent trajectories; playback time is not a matched-state comparison.

Authors and affiliations are omitted because the provided source uses placeholders.
No arXiv identifier, model URL, navigation code repository, or dataset release URL is invented.

## Design references

- https://astra-amap.github.io/omninav.github.io/
- https://internrobotics.github.io/internvla-n1.github.io/
- https://amap-cvlab.github.io/ABot-Navigation/ABot-N1/

Layout and implementation are original. The references informed the academic structure, demonstrations, and results presentation.
