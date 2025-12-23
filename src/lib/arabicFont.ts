// Amiri font for Arabic text support in jsPDF
// This loads the font from Google Fonts CDN

export const loadAmiriFont = async (): Promise<string> => {
  const fontUrl = 'https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.ttf';
  
  try {
    const response = await fetch(fontUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    return base64;
  } catch (error) {
    console.error('Failed to load Amiri font:', error);
    throw error;
  }
};

// Check if text contains Arabic characters
export const containsArabic = (text: string): boolean => {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
};

// Reverse Arabic text for correct RTL display in PDF
export const prepareArabicText = (text: string): string => {
  if (!containsArabic(text)) return text;
  // jsPDF renders text LTR, so we need to reverse Arabic text
  return text.split('').reverse().join('');
};
