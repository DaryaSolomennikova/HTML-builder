const fs = require('fs');
const path = require('path');

function mergeStyles(callback) {
  const stylesDir = path.join(__dirname, 'styles');
  const projectDistDir = path.join(__dirname, 'project-dist');

  fs.mkdir(projectDistDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating project-dist directory', err);
      callback(err);
      return;
    }

    fs.readdir(stylesDir, (err, files) => {
      if (err) {
        console.error('Error reading styles directory', err);
        callback(err);
        return;
      }

      const cssFiles = files.filter((file) => path.extname(file) === '.css');

      const styles = [];

      cssFiles.forEach((file) => {
        const filePath = path.join(stylesDir, file);
        fs.readFile(filePath, 'utf-8', (err, fileContents) => {
          if (err) {
            console.error(`Error reading file ${filePath}`, err);
            callback(err);
            return;
          }

          styles.push(fileContents);

          if (styles.length === cssFiles.length) {
            const bundleContents = styles.join('\n');
            const bundlePath = path.join(projectDistDir, 'bundle.css');

            fs.writeFile(bundlePath, bundleContents, (err) => {
              if (err) {
                console.error('Error writing bundle file', err);
                callback(err);
                return;
              }

              console.log('Bundle created successfully');
              callback(null);
            });
          }
        });
      });
    });
  });
}

mergeStyles((err) => {
  if (err) {
    console.error('Error merging styles', err);
  }
});