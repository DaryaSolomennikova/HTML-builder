const fs = require('fs');
const path = require('path');

const copyDir = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) {
        return reject(err);
      }

      fs.readdir(src, { withFileTypes: true }, (err, files) => {
        if (err) {
          return reject(err);
        }

        const promises = files.map((file) => {
          const srcPath = path.join(src, file.name);
          const destPath = path.join(dest, file.name);

          if (file.isDirectory()) {
            return copyDir(srcPath, destPath);
          } else {
            return new Promise((resolve, reject) => {
              fs.copyFile(srcPath, destPath, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
          }
        });

        Promise.all(promises)
          .then(() => {
            fs.readdir(dest, { withFileTypes: true }, (err, destFiles) => {
              if (err) {
                return reject(err);
              }

              const destPromises = destFiles.map((destFile) => {
                const destPath = path.join(dest, destFile.name);

                if (!files.some((file) => file.name === destFile.name)) {
                  return new Promise((resolve, reject) => {
                    fs.unlink(destPath, (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve();
                      }
                    });
                  });
                } else {
                  return Promise.resolve();
                }
              });

              return Promise.all(destPromises);
            });
          })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  });
};

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'copy');

copyDir(srcDir, destDir)
  .then(() => {
    console.log('Directory successfully copied!');
  })
  .catch((err) => {
    console.error('Error copying directory:', err);
  });
