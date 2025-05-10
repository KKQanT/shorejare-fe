# ShareJore AI Chrome Extension

A Chrome extension built with React and Vite.

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The development server will run on port 3000 by default.

## Building for Production

```bash
npm run build
```

The built extension will be in the `dist` directory.

## Loading the Extension in Chrome

1. Build the extension using `npm run build`
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `dist` directory
5. The extension should now be loaded and accessible from the Chrome toolbar

## Extension Structure

- The popup dimensions are set to 360px width and 600px height
- The manifest.json file is configured for Chrome Extension Manifest V3

## Notes

- You will need to replace the placeholder icon files (icon-16.png, icon-48.png, icon-128.png) with actual icons before publishing the extension
