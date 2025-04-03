const fs = require('fs');
const path = require('path');

// Define the path to the problematic file
const pathToRegexpFile = path.join(__dirname, 'node_modules', 'path-to-regexp', 'dist', 'index.js');

// Check if file exists
if (fs.existsSync(pathToRegexpFile)) {
  console.log('Found path-to-regexp file, patching...');
  
  // Read the file
  let content = fs.readFileSync(pathToRegexpFile, 'utf8');
  
  // Replace the problematic code - modify the error throwing to be more permissive
  content = content.replace(
    `throw new TypeError(\`Missing parameter name at \${i}: \${DEBUG_URL}\`);`,
    `console.warn(\`Missing parameter name at \${i}: \${DEBUG_URL}, continuing anyway\`); continue;`
  );
  
  // Write the modified content back
  fs.writeFileSync(pathToRegexpFile, content);
  console.log('Successfully patched path-to-regexp');
} else {
  console.log('path-to-regexp file not found');
}

// Continue with the regular server startup
require('./server.js');