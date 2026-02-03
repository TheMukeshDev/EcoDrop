const fs = require('fs');
const path = require('path');

try {
    const pngPath = path.resolve('logo.svg');
    const svgPath = path.resolve('public/logo.svg');

    if (!fs.existsSync(pngPath)) {
        console.error('Error: logo.svg not found at root');
        process.exit(1);
    }

    const pngBuffer = fs.readFileSync(pngPath);
    const base64 = pngBuffer.toString('base64');

    // Create minimal SVG wrapper
    const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="512" height="512" xlink:href="data:image/png;base64,${base64}" />
</svg>`;

    fs.writeFileSync(svgPath, svgContent);
    console.log('Successfully created public/logo.svg');
} catch (err) {
    console.error('Failed to create SVG:', err);
    process.exit(1);
}
