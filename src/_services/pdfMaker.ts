import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import { getNextSequence } from './getNextSequence';

// Function to create a PDF from a header and paragraph
async function createPdf(headerText: string, paragraphText: string , path : string): Promise<void> {
  // Create a new PDF document
  paragraphText = paragraphText.replace(/\n/g, ' ');
  const pdfDoc = await PDFDocument.create();

  // Add a page to the document
  const page = pdfDoc.addPage([600, 800]); // Larger page size (600x800)

  // Set margins (left, top, right, bottom)
  const margin = 50;

  // Embed fonts
  const font = await pdfDoc.embedFont('Helvetica');
  const boldFont = await pdfDoc.embedFont('Helvetica-Bold');

  // Define text styles and font sizes
  const headerFontSize = 18;
  const paragraphFontSize = 12;

  const width = page.getWidth() - 2 * margin;  // Text width considering margins
  let y = page.getHeight() - margin;  // Start Y-position from top with margin

  // Draw the header (larger, bold text)
  page.drawText(headerText, {
    x: margin,
    y: y,
    font: boldFont,
    size: headerFontSize,
    maxWidth: width, // Ensure text does not overflow the page
  });

  // Adjust the Y-position after the header (adding space for the header)
  y -= headerFontSize + 10;

  // Wrap the paragraph text so it doesn't overflow
  const lines = wrapText(paragraphText, font, paragraphFontSize, width);

  // Draw the paragraph (normal text)
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: margin,
      y: y - index * (paragraphFontSize + 2),  // Adjust vertical spacing for each line
      font: font,
      size: paragraphFontSize,
      maxWidth: width, // Ensure text doesn't overflow
    });
  });

  // Serialize the PDF document to bytes (PDF data)
  const pdfBytes = await pdfDoc.save();

  // let sequence = await getNextSequence(orgId)
  // const seq = sequence;



  // const environment = process.env.NODE_ENV
  //     const splitDir: any = environment === 'development' ? process.env.content_path
  //         : process.env.content_path;
  //     // console.log(process.env.NODE_ENV)
  //    if (!fs.existsSync(splitDir)) {
  //            fs.mkdirSync(splitDir);
  //    }


  // Save the PDF to a file
    fs.writeFileSync(path, pdfBytes);
  // console.log('PDF created successfully with header and paragraph!');
}

// Helper function to wrap text to fit within the page width
function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  let lines: string[] = [];
  let currentLine = '';
  let currentWidth = 0;

  words.forEach((word) => {
    // Calculate the width of the current word
    const wordWidth = font.widthOfTextAtSize(word, fontSize);

    if (currentWidth + wordWidth < maxWidth) {
      // Add the word to the current line
      currentLine += word + ' ';
      currentWidth += wordWidth + font.widthOfTextAtSize(' ', fontSize);  // Include space width
    } else {
      // If the word doesn't fit, push the current line and start a new line
      lines.push(currentLine.trim());
      currentLine = word + ' ';
      currentWidth = wordWidth + font.widthOfTextAtSize(' ', fontSize);
    }
  });

  // Add the last line
  if (currentLine.length > 0) {
    lines.push(currentLine.trim());
  }

  return lines;
}

// Example usage
// const headerText = 'This is the Header!';
// const paragraphText = 'This is a sample paragraph. It can be a bit longer than the header text. You can add more lines of text here to simulate a paragraph for testing purposes. It should wrap appropriately and not overflow the page.';
// createPdf(headerText, paragraphText,"");

export { 
  createPdf
}
