# White Language Site
![Build Status](https://github.com/pangbai520/White-Language-Site/actions/workflows/deploy.yml/badge.svg)

> The home of the White Language website.

> [!NOTE]
> This repository is specifically for the **website code and documentation**.
> * The core **White Language compiler** source code is located at [pangbai520/White-Language](https://github.com/pangbai520/White-Language).
> * The **VS Code Extension** source code is located at [pangbai520/White-Language-Extension](https://github.com/pangbai520/White-Language-Extension).
> 
> 

## Development

### Building the site locally

This website is built using **Docusaurus 3**. Ensure you have [Node.js](https://nodejs.org/) (version 20 or later) installed.

1. **Install dependencies**:
```bash
npm install
```


2. **Start the development server**:
```bash
npm run start
```

### Where to edit

* **Styles**: Edit [`src/css/custom.css`](src/css/custom.css) for global styles and theme variables.
* **Pages**: Edit React components in [`src/pages/`](src/pages/) (e.g., `index.tsx`, `download.tsx`).
* **Documentation**: Edit Markdown files in the [`docs/`](docs/) directory.
* **Translations**: Edit JSON and Markdown files in the [`i18n/`](i18n/) directory.

### Deployment

**white-lang.org** is currently hosted on **GitHub Pages**. The `main` branch is automatically built and deployed to [www.white-lang.org](https://www.white-lang.org) after each push via GitHub Actions.

### License

Distributed under the [**Apache-2.0 License**](LICENSE).