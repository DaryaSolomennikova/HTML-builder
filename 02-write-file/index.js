const fs = require('fs');
const path = require('path');
const dirPath = './02-write-file';
const filePath = path.join(dirPath, 'text.txt');

process.stdin.on('data', (data) => {
  const text = data.toString().trim();

  if (text === 'exit') {
    console.log('Goodbye, have a nice day!');
    process.exit();
  }

  fs.appendFile(filePath, text, (err) => {
    if (err) throw err;
    console.log('Text added to file!');
  });
});
process.on('SIGINT', () => {
  console.log('Goodbye, have a nice day!');
  process.exit();
});

fs.open(filePath, 'a', (err) => {
  if (err) throw err;
  console.log('Greeting, enter your text!');
});