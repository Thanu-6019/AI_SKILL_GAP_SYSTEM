import pdfParse from 'pdf-parse';
import fs from 'fs/promises';

export const extractTextFromPDF = async (filePath) => {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const data = await pdfParse(fileBuffer);
    
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
};

export const validatePDF = async (filePath) => {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const data = await pdfParse(fileBuffer);
    
    // Basic validation
    if (!data.text || data.text.trim().length < 100) {
      return {
        valid: false,
        message: 'PDF appears to be empty or contains insufficient text',
      };
    }
    
    return {
      valid: true,
      message: 'PDF is valid',
      pages: data.numpages,
      textLength: data.text.length,
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Invalid or corrupted PDF file',
    };
  }
};
