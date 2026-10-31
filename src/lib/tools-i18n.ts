
import type { Lang } from '../i18n';

export const TI: Record<Lang, Record<string, [string, string]>> = {
  en: {
    resizer: ["Image Resizer", "Resize and compress images to exact pixel dimensions and KB limits for online forms. Free and private in your browser."],
    imgpdf: ["Image to PDF", "Convert JPG, PNG and other images into a PDF online. Combine photos into one document for free in your browser."],
    compress: ["Compress PDF", "Compress PDF files online to reduce file size for easier sharing and uploading. Free and private, right in your browser."],
    merge: ["Merge PDF", "Merge multiple PDF files into one document online. Free, private, and easy to use in your browser."],
    split: ["Split PDF", "Split a PDF online into separate pages or smaller PDF files. Free, private, and easy to use in your browser."],
    rotate: ["Rotate PDF", "Rotate PDF pages online to fix sideways or upside-down documents. Free and easy to use in your browser."],
    organize: ["Organize PDF", "Organize PDF pages online by reordering or deleting pages. Arrange your document quickly and easily in your browser."],
    pagenum: ["Page Numbers", "Add page numbers to PDF files online. Number your document pages easily with this free browser-based tool."],
    watermark: ["Watermark", "Add a text watermark to every page of your PDF online. Customize your document in your browser."],
    crop: ["Crop PDF", "Crop PDF pages online to trim unwanted margins and adjust the visible page area. Free and easy to use."],
    pdf2jpg: ["PDF to JPG", "Convert PDF pages into JPG images online. Extract page images for sharing or reuse in your browser."],
    sign: ["Sign PDF", "Sign PDF files online by adding your signature. Free, private, and easy to use in your browser."],
    scan: ["Scan to PDF", "Turn photos of documents into a PDF online. Combine photographed pages into a downloadable PDF in your browser."],
    repair: ["Repair PDF", "Try to repair a damaged or corrupted PDF file online. Use this free browser-based tool to attempt to recover your document."],
    edit: ["Edit PDF", "Edit PDF files online by adding text, images and shapes. Make simple document changes in your browser."],
    forms: ["PDF Forms", "Fill in interactive PDF form fields online. Complete supported PDF forms directly in your browser."],
    pdf2md: ["PDF to Markdown", "Convert PDF text into Markdown online for easier editing and reuse. Extract document text in your browser."],
    redact: ["Redact PDF", "Redact sensitive information in a PDF by permanently hiding selected text. Protect private details in your document."],
    compare: ["Compare PDF", "Compare two PDF versions online to identify differences and changes between documents."],
    ocr: ["OCR PDF", "Use OCR to make scanned PDF documents searchable. Extract recognized text from supported scanned files in your browser."],
    protect: ["Protect PDF", "Protect a PDF file with a password online. Add password protection to your document in your browser."],
    unlock: ["Unlock PDF", "Remove password protection from a PDF when you have permission and the required password. Use this browser-based tool."],
  },
  hi: {
    resizer: ["इमेज रीसाइज़र", "सही पिक्सल और KB में रीसाइज़ करें"],
    imgpdf: ["इमेज से PDF", "फ़ोटो को एक PDF में बदलें"],
    compress: ["PDF कंप्रेस", "PDF की फ़ाइल साइज़ घटाएँ"],
    merge: ["PDF मर्ज", "कई PDF को एक में जोड़ें"],
    split: ["PDF स्प्लिट", "पेजों को अलग PDF में बाँटें"],
    rotate: ["PDF रोटेट", "पेजों को सही दिशा में घुमाएँ"],
    organize: ["PDF ऑर्गनाइज़", "पेजों का क्रम बदलें या हटाएँ"],
    pagenum: ["पेज नंबर", "PDF में पेज नंबर जोड़ें"],
    watermark: ["वॉटरमार्क", "हर पेज पर टेक्स्ट स्टैम्प लगाएँ"],
    crop: ["PDF क्रॉप", "पेज के किनारे काटें"],
    pdf2jpg: ["PDF से JPG", "हर पेज को इमेज में बदलें"],
    sign: ["PDF पर सिग्नेचर", "पेज पर अपना सिग्नेचर लगाएँ"],
    scan: ["स्कैन से PDF", "पेजों की फ़ोटो लेकर PDF बनाएँ"],
    repair: ["PDF रिपेयर", "ख़राब PDF ठीक करने की कोशिश करें"],
    edit: ["PDF एडिट", "टेक्स्ट, इमेज और शेप जोड़ें"],
    forms: ["PDF फ़ॉर्म", "फ़ॉर्म के खाने भरें"],
    pdf2md: ["PDF से Markdown", "टेक्स्ट को Markdown में निकालें"],
    redact: ["PDF रिडैक्ट", "संवेदनशील जानकारी हमेशा के लिए छिपाएँ"],
    compare: ["PDF तुलना", "दो वर्ज़न के बदलाव पहचानें"],
    ocr: ["OCR PDF", "स्कैन की PDF को खोजने लायक बनाएँ"],
    protect: ["PDF प्रोटेक्ट", "PDF को पासवर्ड से लॉक करें"],
    unlock: ["PDF अनलॉक", "PDF का पासवर्ड हटाएँ"],
  },
};

export const TU: Record<Lang, Record<'search' | 'popExams' | 'popTools' | 'gImage' | 'gOrganize' | 'gEdit' | 'gOptimize' | 'gSecure' | 'gRead', string>> = {
  en: {
    search: "Search tools",
    popExams: "Popular exams",
    popTools: "Popular tools",
    gImage: "Image tools",
    gOrganize: "Organize PDF",
    gEdit: "Edit and sign",
    gOptimize: "Optimize",
    gSecure: "Protect and redact",
    gRead: "Read and compare"
  },
  hi: {
    search: "टूल खोजें",
    popExams: "लोकप्रिय परीक्षाएँ",
    popTools: "लोकप्रिय टूल्स",
    gImage: "इमेज टूल्स",
    gOrganize: "PDF व्यवस्थित करें",
    gEdit: "एडिट और सिग्नेचर",
    gOptimize: "ऑप्टिमाइज़",
    gSecure: "सुरक्षा और रिडैक्ट",
    gRead: "पढ़ें और तुलना करें"
  }
};
