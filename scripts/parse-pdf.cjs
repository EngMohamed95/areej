const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function run() {
  try {
    const data = fs.readFileSync('./Menu.pdf');
    const parser = new PDFParse({ data });
    
    console.log('Fetching text...');
    const textResult = await parser.getText();
    console.log('Total pages:', textResult.totalPages || (textResult.pages ? textResult.pages.length : 'unknown'));
    console.log('Text length:', textResult.text ? textResult.text.length : 0);
    
    fs.writeFileSync('./extracted_menu.txt', textResult.text || '', 'utf8');
    console.log('Successfully wrote extracted_menu.txt');
    
    if (textResult.pages) {
      console.log('Pages count:', textResult.pages.length);
      fs.writeFileSync('./extracted_pages.json', JSON.stringify(textResult.pages, null, 2), 'utf8');
    }
  } catch (err) {
    console.error('Error parsing PDF:', err);
  }
}

run();
