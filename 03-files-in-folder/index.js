const fs = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true })
  .then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        const fileName = path.parse(file.name).name;
        const fileExtension = path.parse(file.name).ext.substr(1);
        const filePath = path.join(folderPath, file.name);

        fs.stat(filePath)
          .then((stats) => {
            const fileSizeInBytes = stats.size;
            console.log(
              `${fileName} - ${fileExtension} - ${fileSizeInBytes} bytes`,
            );
          })
          .catch((err) =>
            console.error(
              `Error getting stats for file ${file.name}: ${err.message}`,
            ),
          );
      }
    });
  })
  .catch((err) =>
    console.error(`Error reading directory ${folderPath}: ${err.message}`),
  );
