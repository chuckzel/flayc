# flayc

**Live on GitHub Pages: https://chuckzel.github.io/flayc/main/**

A visual layout builder for arranging uploaded images on printable pages directly in the browser.

Photo Print Layout Studio lets users upload photos, define page structure visually, and create print-ready layouts without needing external design software. Layout logic is built using a block-based editor, while the result is rendered instantly in a printable preview.

## Usage

1. **Upload images**

   Add photos using the picture manager panel. Uploaded files become available as layout elements.

2. **Build your layout**

   Use the visual block editor to create the page structure:

   - Page block is the root component and defines the page size and lays out inside items vertically
   - Containers define sections and, by default, lay out items horizontally
   - Styling blocks control appearance and layout behavior
   - Image blocks place photos

3. **Preview**

   The print preview updates to show how the page will look when printed.

4. **Print**

   When the layout is ready, print directly from the browser.

## Development

The app is built with TypeScript, React, Vite and the block interface uses Blockly.

### Build from source

```
git clone https://github.com/chuckzel/flayc.git
npm run dev  # run in watch mode
npm run build  # typecheck and build into ./dist
npm run test:run  # run tests with vitest
```
