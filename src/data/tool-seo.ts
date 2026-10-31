
export type ToolSeoContent = {
  heading: string;
  intro: string;
  howTo: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  related: string[];
};

export const TOOL_SEO: Record<string, ToolSeoContent> = {
  resizer: {
    heading: 'Resize Images Online for Free',
    intro: 'Resize images online with Docs Are Easy. Adjust image dimensions and compress images to meet the requirements of online forms and document applications. Prepare your images directly in your browser.',
    howTo: [
      'Open the Image Resizer and select an image from your device.',
      'Enter the required image dimensions.',
      'Adjust the available image settings to meet your requirements.',
      'Process the image and download the result.',
    ],
    benefits: [
      'Resize images to specified pixel dimensions.',
      'Adjust image file size using available compression settings.',
      'Prepare images for online application forms.',
      'Process images directly in your browser.',
    ],
    faqs: [
      { question: 'How do I resize an image online?', answer: 'Select your image, enter the required dimensions, adjust the available settings and download the processed image.' },
      { question: 'Can I reduce an image file size?', answer: 'Yes. Use the available compression settings to reduce the image size. The final result depends on the original image and selected settings.' },
      { question: 'Can I resize images for online forms?', answer: 'Yes. You can enter the pixel dimensions required by an online form and prepare your image accordingly.' },
    ],
    related: ['imgpdf', 'scan', 'pdf2jpg'],
  },

  imgpdf: {
    heading: 'Convert Images to PDF Online for Free',
    intro: 'Convert JPG, PNG and other supported images into a PDF document with Docs Are Easy. Turn photographs, scanned pages and image files into a document that is easier to share, store and submit.',
    howTo: [
      'Open Image to PDF and select the images you want to convert.',
      'Add the images you want included in your document.',
      'Review the selected images and available page settings.',
      'Start the conversion and download your PDF.',
    ],
    benefits: [
      'Convert image files into a PDF document.',
      'Combine selected images into a document.',
      'Prepare photographed documents for digital submission.',
      'Use the tool directly in your browser.',
    ],
    faqs: [
      { question: 'How do I convert an image to PDF?', answer: 'Select your image, use the available conversion settings and download the generated PDF.' },
      { question: 'Can I convert multiple images into one PDF?', answer: 'Yes. Select multiple images to include them in a single PDF document.' },
      { question: 'Which image formats are supported?', answer: 'JPG and PNG are common supported image formats. Check the file picker and tool interface for the formats accepted by the current version.' },
    ],
    related: ['resizer', 'scan', 'compress'],
  },

  compress: {
    heading: 'Compress PDF Files Online',
    intro: 'Reduce the file size of a PDF with Docs Are Easy. Compress large PDF documents to make them easier to store, share and upload when a website or application has a file-size limit.',
    howTo: [
      'Open Compress PDF and select a PDF file.',
      'Choose the available compression settings.',
      'Start the compression process.',
      'Download the compressed PDF and check its file size.',
    ],
    
benefits: [     
  'Reduce PDF file size for easier sharing.',
  'Prepare documents for file-size-limited uploads.',
  'Process documents using a browser-based tool.',
  'Check the resulting file before submitting it.',
    ],
    faqs: [
    {
        question: 'How can I reduce PDF file size?',
        answer: 'Select your PDF, choose the available compression settings and download the compressed document.',
    },
    {
        question: 'Will compressing a PDF reduce its quality?',
        answer: 'Compression can affect image quality depending on the settings and contents of the original PDF. Review the output before using it.',
    },
    {
        question: 'Can I compress a PDF for an online application?',
        answer: 'Yes. You can try reducing the PDF size to meet an application upload limit. Always check the final size against the application requirements.',
    },
    ],
    related: ['merge', 'split', 'imgpdf'],
    },

merge: {
  heading: 'Merge PDF Files Online for Free',
  intro: 'Combine multiple PDF files into one document with Docs Are Easy. Merge documents into a single PDF for easier sharing, printing, archiving or submission. The tool processes your files on your device.',
  howTo: [
    'Open Merge PDF and select the PDF files you want to combine.',
    'Add the documents you want included in the final PDF.',
    'Review the selected files and their order, where supported.',
    'Start merging and download the combined PDF.',
  ],

    
benefits: [
  'Combine multiple PDF documents into one file.',
  'Prepare related documents as a single PDF.',
  'Simplify document sharing and organisation.',
  'Process files on your device.',
],
faqs: [
  {
    question: 'How do I combine two PDF files?',
    answer: 'Select both PDF files in the Merge PDF tool and start the merging process.',
  },
  {
    question: 'Can I merge multiple PDF files?',
    answer: "Yes. You can select multiple PDF files and combine them into one document, subject to the tool's supported limits.",
  },
  {
    question: 'Are my PDF files uploaded?',
    answer: 'Docs Are Easy processes files on your device rather than uploading them to its server.',
  },
],
related: ['split', 'organize', 'compress'],
},


  split: {
    heading: 'Split PDF Files Online',
    intro: 'Split a PDF into smaller documents with Docs Are Easy. Extract the pages you need or divide a large document into separate PDF files using the available page-selection options.',
    howTo: [
      'Open Split PDF and select your document.',
      'Choose the pages or page ranges you want to separate.',
      'Review the selected pages and splitting options.',
      'Process the document and download the resulting files.',
    ],
    benefits: [
      'Separate selected pages from a PDF.',
      'Create smaller PDF documents from a larger file.',
      'Extract relevant pages for sharing or submission.',
      'Work with PDF files in your browser.',
    ],
    faqs: [
      { question: 'How do I split a PDF into separate files?', answer: 'Select your PDF, specify the pages or ranges using the available options and process the document.' },
      { question: 'Can I extract specific pages from a PDF?', answer: 'Yes. Use the page-selection options to extract the pages you need.' },
      { question: 'Does splitting a PDF change the original file?', answer: 'The tool creates output files for download. Keep your original document if you need an unchanged copy.' },
    ],
    related: ['merge', 'organize', 'crop'],
  },

  rotate: {
    heading: 'Rotate PDF Pages Online',
    intro: 'Correct the orientation of PDF pages with Docs Are Easy. Rotate pages that appear sideways or upside down so your document is easier to read, print and share.',
    howTo: [
      'Open Rotate PDF and select a PDF document.',
      'Choose the page or pages that need rotation.',
      'Select the required rotation direction.',
      'Apply the changes and download the updated PDF.',
    ],
    benefits: [
      'Correct sideways PDF pages.',
      'Fix upside-down page orientation.',
      'Prepare documents for reading and printing.',
      'Make page-orientation changes in your browser.',
    ],
    faqs: [
      { question: 'How do I rotate a PDF page?', answer: 'Select your PDF, choose the page that needs adjustment and apply the required rotation.' },
      { question: 'Can I rotate individual pages?', answer: 'Use the page-selection controls provided by the tool to choose the pages you want to rotate.' },
      { question: 'Can I save the rotated PDF?', answer: 'Yes. Download the processed PDF after applying the rotation.' },
    ],
    related: ['organize', 'crop', 'merge'],
  },

  organize: {
    heading: 'Organize PDF Pages Online',
    intro: 'Organize PDF pages with Docs Are Easy. Arrange document pages in a more useful order or remove pages you do not need to create a cleaner PDF.',
    howTo: [
      'Open Organize PDF and select your document.',
      'Review the pages displayed by the tool.',
      'Reorder or remove pages using the available controls.',
      'Apply your changes and download the updated PDF.',
    ],
    benefits: [
      'Rearrange PDF pages.',
      'Remove unwanted pages.',
      'Improve the order of a document.',
      'Prepare a more organised PDF for sharing.',
    ],
    faqs: [
      { question: 'How can I rearrange PDF pages?', answer: 'Open your document in the Organize PDF tool and use its page controls to arrange the pages.' },
      { question: 'Can I delete pages from a PDF?', answer: 'Yes. Select the unwanted pages using the available controls and apply your changes.' },
      { question: 'Can I download the reorganised PDF?', answer: 'Yes. Download the resulting document after organising its pages.' },
    ],
    related: ['split', 'rotate', 'merge'],
  },

  pagenum: {
    heading: 'Add Page Numbers to PDF Online',
    intro: 'Add page numbers to your PDF documents with Docs Are Easy. Number pages to make reports, study material and other multi-page documents easier to navigate and reference.',
    howTo: [
      'Open Page Numbers and select a PDF.',
      'Choose the available page-number settings.',
      'Review the numbering options and placement.',
      'Apply the page numbers and download your PDF.',
    ],
    benefits: [
      'Add page numbers to PDF documents.',
      'Make multi-page documents easier to navigate.',
      'Prepare reports and study documents.',
      'Customise numbering using the available settings.',
    ],
    faqs: [
      { question: 'How do I add page numbers to a PDF?', answer: 'Select your PDF, configure the available numbering settings and download the processed document.' },
      { question: 'Can I choose where page numbers appear?', answer: 'Use the placement options provided by the tool, if available.' },
      { question: 'Can I number a multi-page document?', answer: 'Yes. The tool is designed to add page numbers to PDF documents.' },
    ],
    related: ['watermark', 'edit', 'organize'],
  },

  watermark: {
    heading: 'Add a Watermark to PDF Online',
    intro: 'Add a text watermark to your PDF with Docs Are Easy. Use a visible label such as a document status, draft notice or ownership note to identify your document.',
    howTo: [
      'Open Watermark PDF and select your document.',
      'Enter the text you want to use as a watermark.',
      'Adjust the available watermark settings.',
      'Apply the watermark and download the resulting PDF.',
    ],
    benefits: [
      'Add text watermarks to PDF pages.',
      'Identify documents with labels such as Draft.',
      'Customise the watermark using available settings.',
      'Prepare watermarked documents in your browser.',
    ],
    faqs: [
      { question: 'How do I add a watermark to a PDF?', answer: 'Select your PDF, enter the watermark text, adjust the available settings and process the document.' },
      { question: 'Can I add a Draft watermark?', answer: 'Yes. Enter Draft as the watermark text and apply it using the available settings.' },
      { question: 'Can I customise a text watermark?', answer: 'Use the customisation options available in the watermark tool.' },
    ],
    related: ['pagenum', 'protect', 'edit'],
  },

  crop: {
    heading: 'Crop PDF Pages Online',
    intro: 'Crop PDF pages with Docs Are Easy to adjust the visible page area and trim unwanted margins. Prepare pages with a more suitable layout for reading or sharing.',
    howTo: [
      'Open Crop PDF and select your document.',
      'Choose the page or pages you want to crop.',
      'Adjust the crop area using the available controls.',
      'Apply the crop and download the resulting PDF.',
    ],
    benefits: [
      'Trim unwanted PDF page margins.',
      'Adjust the visible page area.',
      'Prepare document pages for sharing.',
      'Make page adjustments in your browser.',
    ],
    faqs: [
      { question: 'How do I crop a PDF page?', answer: 'Select your PDF, adjust the crop area using the tool and apply the changes.' },
      { question: 'Can I remove unwanted margins?', answer: 'Yes. Cropping can reduce the visible page area and trim margins.' },
      { question: 'Will cropping change the PDF page area?', answer: 'Cropping adjusts the visible area of the page. Review the resulting PDF to confirm it meets your needs.' },
    ],
    related: ['rotate', 'organize', 'edit'],
  },

  pdf2jpg: {
    heading: 'Convert PDF to JPG Online',
    intro: 'Convert PDF pages into JPG images with Docs Are Easy. Extract page images from a PDF for viewing, sharing or reusing in other documents and workflows.',
    howTo: [
      'Open PDF to JPG and select a PDF document.',
      'Choose the available page or conversion settings.',
      'Start converting the PDF pages into images.',
      'Download the generated JPG images.',
    ],
    benefits: [
      'Convert PDF pages into JPG images.',
      'Extract images of document pages.',
      'Make pages easier to share as image files.',
      'Use a browser-based conversion workflow.',
    ],
    faqs: [
      { question: 'How do I convert PDF to JPG?', answer: 'Select your PDF, choose the available conversion settings and download the generated images.' },
      { question: 'Can I convert every PDF page?', answer: 'Use the page-selection options provided by the tool to choose the pages to convert.' },
      { question: 'Why convert a PDF page to JPG?', answer: 'JPG images can be useful when you need to share or reuse a page as an image rather than as a PDF.' },
    ],
    related: ['imgpdf', 'resizer', 'scan'],
  },

  sign: {
    heading: 'Sign PDF Documents Online',
    intro: 'Add your signature to a PDF document with Docs Are Easy. Prepare documents that need a signature using the available signing controls in your browser.',
    howTo: [
      'Open Sign PDF and select your document.',
      'Create or select your signature using the available controls.',
      'Place the signature in the appropriate area.',
      'Apply the signature and download the resulting PDF.',
    ],
    benefits: [
      'Add a signature to a PDF document.',
      'Prepare documents for digital sharing.',
      'Position a signature using the available controls.',
      'Work with documents in your browser.',
    ],
    faqs: [
      { question: 'How do I sign a PDF online?', answer: 'Select your document, create or select a signature, place it using the tool and download the signed PDF.' },
      { question: 'Can I add my handwritten signature?', answer: 'Use the signature creation options provided by the tool to add your signature.' },
      { question: 'Is this the same as a legally certified digital signature?', answer: 'A signature image or visual mark is not necessarily a legally certified digital signature. Check the receiving organisation’s signature requirements.' },
    ],
    related: ['edit', 'forms', 'protect'],
  },

  scan: {
    heading: 'Scan Documents to PDF Online',
    intro: 'Turn photographs of documents into a PDF with Docs Are Easy. Combine photographed pages into a digital document that is easier to store, share and submit.',
    howTo: [
      'Open Scan to PDF and select document photographs.',
      'Add the photographed pages you want in your PDF.',
      'Review the selected images and available settings.',
      'Create and download the PDF document.',
    ],
    benefits: [
      'Turn document photographs into a PDF.',
      'Combine photographed pages into one document.',
      'Prepare digital copies of paper documents.',
      'Use a browser-based workflow.',
    ],
    faqs: [
      { question: 'How do I convert scanned photos into a PDF?', answer: 'Select the photographs of your document, review the selected pages and create the PDF.' },
      { question: 'Can I combine multiple photographed pages?', answer: 'Yes. Add multiple document photographs to create a PDF containing the selected pages.' },
      { question: 'Is a photo-based PDF automatically searchable?', answer: 'No. A PDF created from images may need OCR processing to make its text searchable.' },
    ],
    related: ['imgpdf', 'ocr', 'pdf2jpg'],
  },

  repair: {
    heading: 'Try to Repair a Damaged PDF Online',
    intro: 'Use Docs Are Easy to attempt to repair a damaged or corrupted PDF. The tool provides a browser-based recovery attempt, although some severely damaged or unsupported files may not be recoverable.',
    howTo: [
      'Open Repair PDF and select the damaged document.',
      'Start the available repair process.',
      'Wait for the tool to attempt document recovery.',
      'If a repaired file is generated, download it and check that it opens correctly.',
    ],
    benefits: [
      'Attempt recovery of a damaged PDF.',
      'Try to resolve problems opening a document.',
      'Use a browser-based repair tool.',
      'Check the recovered file before relying on it.',
    ],
    faqs: [
      { question: 'Can a corrupted PDF be repaired?', answer: 'Some damaged PDFs may be recoverable, but repair is not guaranteed. The result depends on the type and extent of corruption.' },
      { question: 'Will every damaged PDF be recovered?', answer: 'No. Some files may be too severely damaged or unsupported to repair.' },
      { question: 'What should I do after repairing a PDF?', answer: 'Open the downloaded file and check its pages and contents before using or sharing it.' },
    ],
    related: ['compress', 'merge', 'split'],
  },

  edit: {
    heading: 'Edit PDF Files Online',
    intro: 'Make simple changes to PDF documents with Docs Are Easy. Add text, images and shapes using the available editing tools, then download your updated document.',
    howTo: [
      'Open Edit PDF and select your document.',
      'Choose the editing tool you want to use.',
      'Add text, images or shapes to the document.',
      'Review your changes and download the edited PDF.',
    ],
    benefits: [
      'Add text to a PDF.',
      'Insert images and shapes using available tools.',
      'Make simple visual changes to a document.',
      'Download the edited document.',
    ],
    faqs: [
      { question: 'Can I edit a PDF online?', answer: 'Yes. Use the editing controls to add supported elements such as text, images and shapes.' },
      { question: 'Can I add text to a PDF?', answer: 'Yes. Select the text tool and add text to the document using the available controls.' },
      { question: 'Can I change existing PDF text?', answer: 'The available editing tools are intended for adding supported elements. Editing existing embedded text may not be supported.' },
    ],
    related: ['sign', 'watermark', 'redact'],
  },

  forms: {
    heading: 'Fill PDF Forms Online',
    intro: 'Complete supported interactive PDF forms with Docs Are Easy. Fill in available form fields in your browser and download the completed document.',
    howTo: [
      'Open PDF Forms and select your PDF form.',
      'Click or select the available interactive form fields.',
      'Enter the required information in the supported fields.',
      'Download the completed PDF.',
    ],
    benefits: [
      'Fill supported interactive PDF form fields.',
      'Complete document forms in your browser.',
      'Prepare filled forms for review or submission.',
      'Download the completed document.',
    ],
    faqs: [
      { question: 'How do I fill in a PDF form?', answer: 'Open the PDF form, enter information in the supported interactive fields and download the completed document.' },
      { question: 'Can I fill every PDF form?', answer: 'The tool supports interactive PDF form fields. Some flat, scanned or unsupported forms may not be editable.' },
      { question: 'Can I save a completed PDF form?', answer: 'Download the completed PDF after filling the supported fields.' },
    ],
    related: ['sign', 'edit', 'protect'],
  },

  pdf2md: {
    heading: 'Convert PDF to Markdown Online',
    intro: 'Extract text from PDF documents and convert it into Markdown with Docs Are Easy. Reuse document text in notes, technical documentation and Markdown-based writing workflows.',
    howTo: [
      'Open PDF to Markdown and select a PDF.',
      'Start the text extraction and conversion process.',
      'Review the generated Markdown content.',
      'Download or copy the resulting content using the available options.',
    ],
    benefits: [
      'Extract text from PDF documents.',
      'Convert extracted content into Markdown.',
      'Reuse document text in Markdown workflows.',
      'Prepare text for editing and documentation.',
    ],
    faqs: [
      { question: 'How do I convert a PDF to Markdown?', answer: 'Select your PDF and start the conversion process. Review the generated Markdown output.' },
      { question: 'Does PDF to Markdown preserve the original layout?', answer: 'Text extraction and Markdown conversion may not preserve complex page layouts, columns, tables or visual formatting exactly.' },
      { question: 'Can I convert scanned PDFs?', answer: 'Scanned documents may require OCR before their text can be extracted. Use the OCR PDF tool where appropriate.' },
    ],
    related: ['ocr', 'compare', 'edit'],
  },

  redact: {
    heading: 'Redact Sensitive Information in PDF Files',
    intro: 'Use Docs Are Easy to redact selected information in a PDF by permanently hiding the chosen content. Review the processed document carefully before sharing it.',
    howTo: [
      'Open Redact PDF and select your document.',
      'Identify the text or areas containing sensitive information.',
      'Select the areas you want to redact using the available controls.',
      'Apply the redactions, download the PDF and verify the result.',
    ],
    benefits: [
      'Hide selected sensitive information in a PDF.',
      'Prepare documents before sharing.',
      'Redact selected areas using the available controls.',
      'Review the resulting document before distribution.',
    ],
    faqs: [
      { question: 'What does redacting a PDF mean?', answer: 'Redaction means permanently removing or hiding selected sensitive information so it is not visible in the shared document.' },
      { question: 'Is covering text with a black shape the same as redaction?', answer: 'No. A visual overlay may leave the underlying text accessible. Use the actual redaction function and verify the resulting file.' },
      { question: 'What should I check after redacting a PDF?', answer: 'Inspect the resulting document and check that the sensitive information is no longer visible or extractable before sharing it.' },
    ],
    related: ['protect', 'edit', 'sign'],
  },

  compare: {
    heading: 'Compare Two PDF Files Online',
    intro: 'Compare two PDF documents with Docs Are Easy to review differences between document versions. Use the comparison output to help identify changes before accepting or sharing an updated file.',
    howTo: [
      'Open Compare PDF and select the first PDF.',
      'Select the second PDF you want to compare.',
      'Start the comparison process.',
      'Review the differences identified by the tool.',
    ],
    benefits: [
      'Compare two PDF documents.',
      'Review differences between document versions.',
      'Check changes before sharing an updated document.',
      'Use a browser-based comparison workflow.',
    ],
    faqs: [
      { question: 'How do I compare two PDF files?', answer: 'Select both PDF documents in the comparison tool and start the comparison process.' },
      { question: 'Can I compare different versions of a document?', answer: 'Yes. The tool is intended to help compare two PDF versions and identify differences.' },
      { question: 'Will every visual difference be detected?', answer: 'Comparison results depend on the document contents and the tool’s supported comparison method. Review the documents yourself for important changes.' },
    ],
    related: ['merge', 'pdf2md', 'ocr'],
  },

  ocr: {
    heading: 'Make Scanned PDFs Searchable with OCR',
    intro: 'Use OCR to recognise text in supported scanned PDF documents with Docs Are Easy. Extract recognised text from page images so that document contents can be searched or reused.',
    howTo: [
      'Open OCR PDF and select a scanned document.',
      'Start the OCR process using the available settings.',
      'Allow the tool to recognise text from the scanned pages.',
      'Review and use the recognised text or generated output.',
    ],
    benefits: [
      'Recognise text from supported scanned PDF pages.',
      'Extract text from document images.',
      'Make scanned document content easier to search and reuse.',
      'Review recognised text for accuracy.',
    ],
    faqs: [
      { question: 'What is OCR in a PDF?', answer: 'OCR stands for Optical Character Recognition. It identifies text in scanned page images and converts it into machine-readable text.' },
      { question: 'Can OCR make a scanned PDF searchable?', answer: 'OCR can recognise text in supported scanned documents. Searchability depends on the output produced by the tool.' },
      { question: 'Is OCR always accurate?', answer: 'No. Accuracy can vary with image quality, handwriting, language, fonts and document condition. Review the recognised text.' },
    ],
    related: ['scan', 'pdf2md', 'imgpdf'],
  },

  protect: {
    heading: 'Protect PDF Files with a Password',
    intro: 'Add password protection to a PDF with Docs Are Easy. Protect documents before sharing them by using the password settings supported by the tool.',
    howTo: [
      'Open Protect PDF and select your document.',
      'Enter a password using the available settings.',
      'Apply password protection to the PDF.',
      'Download the protected document and keep the password somewhere safe.',
    ],
    benefits: [
      'Add password protection to a PDF.',
      'Prepare documents for more controlled sharing.',
      'Use the available protection settings.',
      'Process the document in your browser.',
    ],
    faqs: [
      { question: 'How do I password-protect a PDF?', answer: 'Select your PDF, enter a password in the protection tool and download the resulting document.' },
      { question: 'What happens if I forget the PDF password?', answer: 'You may be unable to open the protected document. Keep a secure record of the password.' },
      { question: 'Does password protection guarantee complete security?', answer: 'Password protection adds a security layer, but it does not replace careful handling of sensitive files and passwords.' },
    ],
    related: ['unlock', 'redact', 'sign'],
  },

  unlock: {
    heading: 'Unlock a PDF with Its Password',
    intro: 'Remove password protection from a PDF when you have permission and the required password. Use Docs Are Easy to process supported protected documents in your browser.',
    howTo: [
      'Open Unlock PDF and select the protected document.',
      'Enter the required password when prompted.',
      'Start the unlocking process.',
      'Download the resulting PDF and check that it opens correctly.',
    ],
    benefits: [
      'Process supported password-protected PDFs.',
      'Use the required password to unlock a document.',
      'Prepare an accessible copy when you have permission.',
      'Work with files in your browser.',
    ],
    faqs: [
      { question: 'How do I unlock a PDF?', answer: 'Select the protected PDF, provide its required password and use the tool to process the document.' },
      { question: 'Can I unlock a PDF without its password?', answer: 'This tool requires the password for supported protected documents. It is not intended to bypass access controls.' },
      { question: 'Is it legal to unlock a PDF?', answer: 'Only unlock documents when you own them or have permission from the document owner.' },
    ],
    related: ['protect', 'sign', 'forms'],
  },
};


// Hindi SEO content. Keep the same structure as the English entries above.
export const TOOL_SEO_HI: Record<string, ToolSeoContent> = {
  resizer: {
    heading: 'इमेज का आकार ऑनलाइन मुफ़्त में बदलें',
    intro: 'Docs Are Easy की मदद से अपनी इमेज का आकार और फ़ाइल साइज़ बदलें। ऑनलाइन फ़ॉर्म और दस्तावेज़ों के लिए ज़रूरी इमेज तैयार करें।',
    howTo: [
      'Image Resizer खोलें और अपने डिवाइस से इमेज चुनें।',
      'ज़रूरी पिक्सेल dimensions दर्ज करें।',
      'उपलब्ध सेटिंग्स से इमेज का आकार और गुणवत्ता समायोजित करें।',
      'प्रक्रिया पूरी होने पर तैयार इमेज डाउनलोड करें।',
    ],
    benefits: [
      'इमेज को निर्धारित पिक्सेल आकार में बदलें।',
      'उपलब्ध सेटिंग्स से इमेज का फ़ाइल साइज़ घटाएँ।',
      'ऑनलाइन आवेदन फ़ॉर्म के लिए इमेज तैयार करें।',
      'ब्राउज़र में ही इमेज प्रोसेस करें।',
    ],
    faqs: [
      { question: 'इमेज का आकार ऑनलाइन कैसे बदलें?', answer: 'इमेज चुनें, ज़रूरी dimensions दर्ज करें, उपलब्ध सेटिंग्स समायोजित करें और तैयार इमेज डाउनलोड करें।' },
      { question: 'क्या इमेज का फ़ाइल साइज़ कम कर सकते हैं?', answer: 'हाँ। उपलब्ध compression सेटिंग्स का उपयोग करें। अंतिम साइज़ मूल इमेज और चुनी गई सेटिंग्स पर निर्भर करता है।' },
      { question: 'क्या ऑनलाइन फ़ॉर्म के लिए इमेज तैयार कर सकते हैं?', answer: 'हाँ। फ़ॉर्म में माँगे गए पिक्सेल dimensions दर्ज करके इमेज तैयार कर सकते हैं।' },
    ],
    related: ['imgpdf', 'scan', 'pdf2jpg'],
  },
  imgpdf: {
    heading: 'इमेज को PDF में ऑनलाइन मुफ़्त बदलें',
    intro: 'Docs Are Easy से JPG, PNG और अन्य समर्थित इमेज को PDF दस्तावेज़ में बदलें। फ़ोटो और स्कैन किए गए पन्नों को एक PDF में तैयार करें।',
    howTo: [
      'Image to PDF खोलें और बदलने के लिए इमेज चुनें।',
      'दस्तावेज़ में शामिल की जाने वाली इमेज जोड़ें।',
      'चुनी गई इमेज और उपलब्ध पेज सेटिंग्स जाँचें।',
      'कन्वर्ज़न शुरू करें और PDF डाउनलोड करें।',
    ],
    benefits: [
      'इमेज फ़ाइलों को PDF दस्तावेज़ में बदलें।',
      'चुनी गई कई इमेज को एक दस्तावेज़ में जोड़ें।',
      'फ़ोटो वाले दस्तावेज़ों को डिजिटल सबमिशन के लिए तैयार करें।',
      'ब्राउज़र में ही टूल का उपयोग करें।',
    ],
    faqs: [
      { question: 'इमेज को PDF में कैसे बदलें?', answer: 'इमेज चुनें, उपलब्ध कन्वर्ज़न सेटिंग्स का उपयोग करें और बनी हुई PDF डाउनलोड करें।' },
      { question: 'क्या कई इमेज को एक PDF में बदल सकते हैं?', answer: 'हाँ। एक PDF दस्तावेज़ में शामिल करने के लिए कई इमेज चुनें।' },
      { question: 'कौन-से इमेज फ़ॉर्मेट समर्थित हैं?', answer: 'JPG और PNG सामान्य समर्थित फ़ॉर्मेट हैं। वर्तमान टूल में स्वीकार किए जाने वाले फ़ॉर्मेट की पुष्टि फ़ाइल चयन और टूल इंटरफ़ेस में करें।' },
    ],
    related: ['resizer', 'scan', 'compress'],
  },
  compress: {
    heading: 'PDF फ़ाइल का साइज़ ऑनलाइन कम करें',
    intro: 'Docs Are Easy से PDF का फ़ाइल साइज़ कम करें। बड़ी PDF को साझा करना, स्टोर करना और अपलोड करना आसान बनाएँ, विशेषकर जब वेबसाइट पर फ़ाइल साइज़ की सीमा हो।',
    howTo: [
      'Compress PDF खोलें और PDF फ़ाइल चुनें।',
      'उपलब्ध compression सेटिंग्स चुनें।',
      'कम्प्रेशन प्रक्रिया शुरू करें।',
      'कम्प्रेस की गई PDF डाउनलोड करें और उसका फ़ाइल साइज़ जाँचें।',
    ],
    benefits: [
      'PDF का साइज़ कम करके साझा करना आसान बनाएँ।',
      'फ़ाइल साइज़ सीमा वाले अपलोड के लिए दस्तावेज़ तैयार करें।',
      'ब्राउज़र-आधारित टूल से दस्तावेज़ प्रोसेस करें।',
      'सबमिट करने से पहले तैयार फ़ाइल जाँचें।',
    ],
    faqs: [
      { question: 'PDF का फ़ाइल साइज़ कैसे कम करें?', answer: 'PDF चुनें, उपलब्ध compression सेटिंग्स चुनें और कम्प्रेस किया हुआ दस्तावेज़ डाउनलोड करें।' },
      { question: 'क्या PDF कम्प्रेस करने से गुणवत्ता कम होती है?', answer: 'सेटिंग्स और मूल PDF की सामग्री के अनुसार इमेज गुणवत्ता प्रभावित हो सकती है। उपयोग से पहले तैयार फ़ाइल जाँचें।' },
      { question: 'क्या ऑनलाइन आवेदन के लिए PDF कम्प्रेस कर सकते हैं?', answer: 'हाँ। आवेदन की अपलोड सीमा पूरी करने के लिए PDF का साइज़ कम करने का प्रयास करें। अंतिम साइज़ आवेदन की शर्तों से मिलाएँ।' },
    ],
    related: ['merge', 'split', 'imgpdf'],
  },
  merge: {
    heading: 'PDF फ़ाइलों को ऑनलाइन एक साथ जोड़ें',
    intro: 'Docs Are Easy से कई PDF फ़ाइलों को एक दस्तावेज़ में जोड़ें। साझा करने, प्रिंट करने, संग्रहित करने या जमा करने के लिए दस्तावेज़ों को एक PDF में तैयार करें।',
    howTo: [
      'Merge PDF खोलें और जोड़ने के लिए PDF फ़ाइलें चुनें।',
      'अंतिम PDF में शामिल किए जाने वाले दस्तावेज़ जोड़ें।',
      'चुनी गई फ़ाइलों और उनके क्रम की जाँच करें, जहाँ यह सुविधा उपलब्ध हो।',
      'मर्ज प्रक्रिया शुरू करें और संयुक्त PDF डाउनलोड करें।',
    ],
    benefits: [
      'कई PDF दस्तावेज़ों को एक फ़ाइल में जोड़ें।',
      'संबंधित दस्तावेज़ों को एक PDF के रूप में तैयार करें।',
      'दस्तावेज़ साझा करना और व्यवस्थित रखना आसान बनाएँ।',
      'फ़ाइलों को अपने डिवाइस पर प्रोसेस करें।',
    ],
    faqs: [
      { question: 'दो PDF फ़ाइलों को कैसे जोड़ें?', answer: 'Merge PDF टूल में दोनों PDF फ़ाइलें चुनें और मर्ज प्रक्रिया शुरू करें।' },
      { question: 'क्या कई PDF फ़ाइलों को जोड़ सकते हैं?', answer: 'हाँ। टूल की समर्थित सीमाओं के अनुसार कई PDF चुनकर उन्हें एक दस्तावेज़ में जोड़ सकते हैं।' },
      { question: 'क्या मेरी PDF फ़ाइलें अपलोड होती हैं?', answer: 'Docs Are Easy फ़ाइलों को अपने सर्वर पर अपलोड करने के बजाय आपके डिवाइस पर प्रोसेस करता है।' },
    ],
    related: ['split', 'organize', 'compress'],
  },
  split: {
    heading: 'PDF को ऑनलाइन अलग-अलग फ़ाइलों में बाँटें',
    intro: 'Docs Are Easy से PDF को छोटे दस्तावेज़ों में बाँटें। उपलब्ध पेज चयन विकल्पों से ज़रूरी पन्ने निकालें या बड़े दस्तावेज़ को अलग PDF फ़ाइलों में बाँटें।',
    howTo: [
      'Split PDF खोलें और अपना दस्तावेज़ चुनें।',
      'अलग करने के लिए पेज या पेज रेंज चुनें।',
      'चुने गए पेज और splitting विकल्प जाँचें।',
      'प्रक्रिया पूरी करें और बनी हुई फ़ाइलें डाउनलोड करें।',
    ],
    benefits: [
      'PDF से चुने हुए पेज अलग करें।',
      'बड़ी PDF से छोटी PDF फ़ाइलें बनाएँ।',
      'साझा करने या जमा करने के लिए ज़रूरी पेज निकालें।',
      'ब्राउज़र में PDF फ़ाइलों पर काम करें।',
    ],
    faqs: [
      { question: 'PDF को अलग-अलग फ़ाइलों में कैसे बाँटें?', answer: 'PDF चुनें, उपलब्ध विकल्पों से पेज या रेंज निर्धारित करें और प्रक्रिया शुरू करें।' },
      { question: 'क्या PDF से कुछ खास पेज निकाल सकते हैं?', answer: 'हाँ। ज़रूरी पेज निकालने के लिए उपलब्ध page-selection विकल्पों का उपयोग करें।' },
      { question: 'क्या PDF बाँटने से मूल फ़ाइल बदलती है?', answer: 'टूल डाउनलोड के लिए नई आउटपुट फ़ाइलें बनाता है। मूल दस्तावेज़ की प्रति अपने पास रखें।' },
    ],
    related: ['merge', 'organize', 'crop'],
  },
  rotate: {
    heading: 'PDF के पेज ऑनलाइन घुमाएँ',
    intro: 'Docs Are Easy से PDF पेजों की दिशा ठीक करें। तिरछे या उलटे पन्नों को घुमाकर दस्तावेज़ पढ़ना, प्रिंट करना और साझा करना आसान बनाएँ।',
    howTo: [
      'Rotate PDF खोलें और PDF दस्तावेज़ चुनें।',
      'घुमाने के लिए पेज चुनें।',
      'ज़रूरी rotation दिशा चुनें।',
      'बदलाव लागू करें और अपडेट की गई PDF डाउनलोड करें।',
    ],
    benefits: [
      'PDF के तिरछे पन्नों की दिशा ठीक करें।',
      'उलटे पन्नों को सही दिशा में करें।',
      'पढ़ने और प्रिंट करने के लिए दस्तावेज़ तैयार करें।',
      'ब्राउज़र में पेज की दिशा बदलें।',
    ],
    faqs: [
      { question: 'PDF का पेज कैसे घुमाएँ?', answer: 'PDF चुनें, जिस पेज को ठीक करना है उसे चुनें और ज़रूरी rotation लागू करें।' },
      { question: 'क्या अलग-अलग पेज घुमा सकते हैं?', answer: 'जिन पेजों को घुमाना है उन्हें चुनने के लिए टूल के page-selection controls का उपयोग करें।' },
      { question: 'क्या घुमाई गई PDF डाउनलोड कर सकते हैं?', answer: 'हाँ। rotation लागू करने के बाद प्रोसेस की गई PDF डाउनलोड करें।' },
    ],
    related: ['organize', 'crop', 'merge'],
  },
  organize: {
    heading: 'PDF के पेज ऑनलाइन व्यवस्थित करें',
    intro: 'Docs Are Easy से PDF पेजों को व्यवस्थित करें। दस्तावेज़ का क्रम बदलें या ज़रूरत न होने वाले पेज हटाकर साफ़-सुथरी PDF बनाएँ।',
    howTo: [
      'Organize PDF खोलें और दस्तावेज़ चुनें।',
      'टूल में दिखाए गए पेजों की जाँच करें।',
      'उपलब्ध controls से पेजों का क्रम बदलें या उन्हें हटाएँ।',
      'बदलाव लागू करें और अपडेट की गई PDF डाउनलोड करें।',
    ],
    benefits: [
      'PDF पेजों का क्रम बदलें।',
      'अनचाहे पेज हटाएँ।',
      'दस्तावेज़ का क्रम बेहतर बनाएँ।',
      'साझा करने के लिए PDF व्यवस्थित करें।',
    ],
    faqs: [
      { question: 'PDF पेजों का क्रम कैसे बदलें?', answer: 'Organize PDF टूल में दस्तावेज़ खोलें और पेज व्यवस्थित करने के लिए उपलब्ध controls का उपयोग करें।' },
      { question: 'क्या PDF से पेज हटा सकते हैं?', answer: 'हाँ। उपलब्ध controls से अनचाहे पेज चुनें और बदलाव लागू करें।' },
      { question: 'क्या व्यवस्थित PDF डाउनलोड कर सकते हैं?', answer: 'हाँ। पेज व्यवस्थित करने के बाद बनी हुई PDF डाउनलोड करें।' },
    ],
    related: ['split', 'rotate', 'merge'],
  },
  pagenum: {
    heading: 'PDF में ऑनलाइन पेज नंबर जोड़ें',
    intro: 'Docs Are Easy से PDF दस्तावेज़ों में पेज नंबर जोड़ें। रिपोर्ट, अध्ययन सामग्री और अन्य बहु-पृष्ठ दस्तावेज़ों को पढ़ना और संदर्भित करना आसान बनाएँ।',
    howTo: [
      'Page Numbers खोलें और PDF चुनें।',
      'उपलब्ध page-number सेटिंग्स चुनें।',
      'नंबरिंग के विकल्प और स्थान जाँचें।',
      'पेज नंबर लागू करें और PDF डाउनलोड करें।',
    ],
    benefits: [
      'PDF दस्तावेज़ों में पेज नंबर जोड़ें।',
      'बहु-पृष्ठ दस्तावेज़ों को नेविगेट करना आसान बनाएँ।',
      'रिपोर्ट और अध्ययन दस्तावेज़ तैयार करें।',
      'उपलब्ध सेटिंग्स से नंबरिंग समायोजित करें।',
    ],
    faqs: [
      { question: 'PDF में पेज नंबर कैसे जोड़ें?', answer: 'PDF चुनें, उपलब्ध नंबरिंग सेटिंग्स तय करें और प्रोसेस किया हुआ दस्तावेज़ डाउनलोड करें।' },
      { question: 'क्या पेज नंबर की जगह चुन सकते हैं?', answer: 'यदि टूल में placement विकल्प उपलब्ध हैं, तो उनका उपयोग करें।' },
      { question: 'क्या कई पेजों वाले दस्तावेज़ में नंबर डाल सकते हैं?', answer: 'हाँ। यह टूल PDF दस्तावेज़ों में पेज नंबर जोड़ने के लिए बनाया गया है।' },
    ],
    related: ['watermark', 'edit', 'organize'],
  },
  watermark: {
    heading: 'PDF में ऑनलाइन वॉटरमार्क जोड़ें',
    intro: 'Docs Are Easy से PDF में टेक्स्ट वॉटरमार्क जोड़ें। Draft, दस्तावेज़ की स्थिति या स्वामित्व बताने वाला दिखाई देने वाला लेबल इस्तेमाल करें।',
    howTo: [
      'Watermark PDF खोलें और दस्तावेज़ चुनें।',
      'वॉटरमार्क के रूप में इस्तेमाल किया जाने वाला टेक्स्ट लिखें।',
      'उपलब्ध वॉटरमार्क सेटिंग्स समायोजित करें।',
      'वॉटरमार्क लागू करें और तैयार PDF डाउनलोड करें।',
    ],
    benefits: [
      'PDF पेजों पर टेक्स्ट वॉटरमार्क जोड़ें।',
      'Draft जैसे लेबल से दस्तावेज़ पहचानें।',
      'उपलब्ध सेटिंग्स से वॉटरमार्क समायोजित करें।',
      'ब्राउज़र में वॉटरमार्क वाला दस्तावेज़ तैयार करें।',
    ],
    faqs: [
      { question: 'PDF में वॉटरमार्क कैसे जोड़ें?', answer: 'PDF चुनें, वॉटरमार्क टेक्स्ट लिखें, उपलब्ध सेटिंग्स समायोजित करें और दस्तावेज़ प्रोसेस करें।' },
      { question: 'क्या Draft वॉटरमार्क जोड़ सकते हैं?', answer: 'हाँ। वॉटरमार्क टेक्स्ट में Draft लिखें और उपलब्ध सेटिंग्स से लागू करें।' },
      { question: 'क्या टेक्स्ट वॉटरमार्क को बदल सकते हैं?', answer: 'वॉटरमार्क टूल में उपलब्ध customisation विकल्पों का उपयोग करें।' },
    ],
    related: ['pagenum', 'protect', 'edit'],
  },
  crop: {
    heading: 'PDF पेज ऑनलाइन क्रॉप करें',
    intro: 'Docs Are Easy से PDF पेज क्रॉप करके दिखाई देने वाला पेज क्षेत्र समायोजित करें और अनचाहे margins हटाएँ। पढ़ने और साझा करने के लिए पेज तैयार करें।',
    howTo: [
      'Crop PDF खोलें और दस्तावेज़ चुनें।',
      'क्रॉप करने के लिए पेज चुनें।',
      'उपलब्ध controls से crop area समायोजित करें।',
      'क्रॉप लागू करें और तैयार PDF डाउनलोड करें।',
    ],
    benefits: [
      'PDF पेजों के अनचाहे margins हटाएँ।',
      'पेज का दिखाई देने वाला क्षेत्र समायोजित करें।',
      'साझा करने के लिए दस्तावेज़ पेज तैयार करें।',
      'ब्राउज़र में पेज समायोजित करें।',
    ],
    faqs: [
      { question: 'PDF पेज को कैसे क्रॉप करें?', answer: 'PDF चुनें, टूल से crop area समायोजित करें और बदलाव लागू करें।' },
      { question: 'क्या अनचाहे margins हटा सकते हैं?', answer: 'हाँ। cropping से दिखाई देने वाला पेज क्षेत्र घटाकर margins कम किए जा सकते हैं।' },
      { question: 'क्या क्रॉप करने से PDF का पेज क्षेत्र बदलता है?', answer: 'Cropping पेज के दिखाई देने वाले क्षेत्र को समायोजित करता है। तैयार PDF जाँच लें।' },
    ],
    related: ['rotate', 'organize', 'edit'],
  },
  pdf2jpg: {
    heading: 'PDF को ऑनलाइन JPG में बदलें',
    intro: 'Docs Are Easy से PDF पेजों को JPG इमेज में बदलें। PDF के पेजों को इमेज के रूप में देखने, साझा करने या अन्य दस्तावेज़ों में उपयोग करने के लिए निकालें।',
    howTo: [
      'PDF to JPG खोलें और PDF दस्तावेज़ चुनें।',
      'उपलब्ध पेज या conversion सेटिंग्स चुनें।',
      'PDF पेजों को इमेज में बदलने की प्रक्रिया शुरू करें।',
      'बनी हुई JPG इमेज डाउनलोड करें।',
    ],
    benefits: [
      'PDF पेजों को JPG इमेज में बदलें।',
      'दस्तावेज़ पेजों की इमेज निकालें।',
      'पेजों को इमेज फ़ाइल के रूप में साझा करें।',
      'ब्राउज़र-आधारित conversion प्रक्रिया का उपयोग करें।',
    ],
    faqs: [
      { question: 'PDF को JPG में कैसे बदलें?', answer: 'PDF चुनें, उपलब्ध conversion सेटिंग्स चुनें और बनी हुई इमेज डाउनलोड करें।' },
      { question: 'क्या PDF के सभी पेज बदल सकते हैं?', answer: 'बदलने के लिए पेज चुनने हेतु टूल में दिए गए page-selection विकल्पों का उपयोग करें।' },
      { question: 'PDF पेज को JPG में क्यों बदलें?', answer: 'जब किसी पेज को PDF के बजाय इमेज के रूप में साझा या उपयोग करना हो, तब JPG उपयोगी हो सकता है।' },
    ],
    related: ['imgpdf', 'resizer', 'scan'],
  },
  sign: {
    heading: 'PDF दस्तावेज़ पर ऑनलाइन हस्ताक्षर करें',
    intro: 'Docs Are Easy से PDF दस्तावेज़ में अपना हस्ताक्षर जोड़ें। ब्राउज़र में उपलब्ध signing controls की मदद से हस्ताक्षर वाले दस्तावेज़ तैयार करें।',
    howTo: [
      'Sign PDF खोलें और दस्तावेज़ चुनें।',
      'उपलब्ध controls से हस्ताक्षर बनाएँ या चुनें।',
      'हस्ताक्षर को सही स्थान पर रखें।',
      'हस्ताक्षर लागू करें और तैयार PDF डाउनलोड करें।',
    ],
    benefits: [
      'PDF दस्तावेज़ में हस्ताक्षर जोड़ें।',
      'डिजिटल रूप से साझा करने के लिए दस्तावेज़ तैयार करें।',
      'उपलब्ध controls से हस्ताक्षर की स्थिति तय करें।',
      'ब्राउज़र में दस्तावेज़ पर काम करें।',
    ],
    faqs: [
      { question: 'PDF पर ऑनलाइन हस्ताक्षर कैसे करें?', answer: 'दस्तावेज़ चुनें, हस्ताक्षर बनाएँ या चुनें, उसे टूल में रखें और हस्ताक्षर की गई PDF डाउनलोड करें।' },
      { question: 'क्या अपना हाथ से लिखा हस्ताक्षर जोड़ सकते हैं?', answer: 'हस्ताक्षर जोड़ने के लिए टूल में उपलब्ध signature creation विकल्पों का उपयोग करें।' },
      { question: 'क्या यह कानूनी रूप से प्रमाणित डिजिटल हस्ताक्षर के समान है?', answer: 'हस्ताक्षर की इमेज या दृश्य निशान हमेशा कानूनी रूप से प्रमाणित डिजिटल हस्ताक्षर नहीं होता। संबंधित संस्था की आवश्यकताएँ जाँचें।' },
    ],
    related: ['edit', 'forms', 'protect'],
  },
  scan: {
    heading: 'दस्तावेज़ स्कैन करके ऑनलाइन PDF बनाएँ',
    intro: 'Docs Are Easy से दस्तावेज़ों की फ़ोटो को PDF में बदलें। फ़ोटो वाले पन्नों को ऐसे डिजिटल दस्तावेज़ में जोड़ें जिसे स्टोर करना, साझा करना और जमा करना आसान हो।',
    howTo: [
      'Scan to PDF खोलें और दस्तावेज़ों की फ़ोटो चुनें।',
      'PDF में शामिल किए जाने वाले पन्नों की फ़ोटो जोड़ें।',
      'चुनी गई इमेज और उपलब्ध सेटिंग्स जाँचें।',
      'PDF बनाएँ और डाउनलोड करें।',
    ],
    benefits: [
      'दस्तावेज़ों की फ़ोटो को PDF में बदलें।',
      'कई फ़ोटो वाले पन्नों को एक दस्तावेज़ में जोड़ें।',
      'कागज़ी दस्तावेज़ों की डिजिटल कॉपी तैयार करें।',
      'ब्राउज़र-आधारित प्रक्रिया का उपयोग करें।',
    ],
    faqs: [
      { question: 'स्कैन की गई फ़ोटो को PDF में कैसे बदलें?', answer: 'दस्तावेज़ की फ़ोटो चुनें, पन्नों की जाँच करें और PDF बनाएँ।' },
      { question: 'क्या कई फ़ोटो वाले पन्ने जोड़ सकते हैं?', answer: 'हाँ। चुने गए पन्नों वाली PDF बनाने के लिए कई दस्तावेज़ फ़ोटो जोड़ें।' },
      { question: 'क्या फ़ोटो से बनी PDF अपने आप searchable होती है?', answer: 'नहीं। इमेज से बनी PDF के टेक्स्ट को searchable बनाने के लिए OCR की ज़रूरत हो सकती है।' },
    ],
    related: ['imgpdf', 'ocr', 'pdf2jpg'],
  },
  repair: {
    heading: 'खराब PDF को ऑनलाइन ठीक करने का प्रयास करें',
    intro: 'Docs Are Easy से खराब या corrupted PDF को ठीक करने का प्रयास करें। कुछ बहुत अधिक क्षतिग्रस्त या असमर्थित फ़ाइलें ठीक नहीं हो सकतीं।',
    howTo: [
      'Repair PDF खोलें और खराब दस्तावेज़ चुनें।',
      'उपलब्ध repair प्रक्रिया शुरू करें।',
      'दस्तावेज़ को ठीक करने के प्रयास के पूरा होने तक प्रतीक्षा करें।',
      'यदि repaired फ़ाइल बनती है, तो उसे डाउनलोड करके सही से खुलना जाँचें।',
    ],
    benefits: [
      'खराब PDF को recover करने का प्रयास करें।',
      'दस्तावेज़ खोलने में आने वाली समस्या दूर करने की कोशिश करें।',
      'ब्राउज़र-आधारित repair टूल का उपयोग करें।',
      'Recovered फ़ाइल पर भरोसा करने से पहले उसे जाँचें।',
    ],
    faqs: [
      { question: 'क्या corrupted PDF ठीक हो सकती है?', answer: 'कुछ खराब PDF recover हो सकती हैं, लेकिन इसकी गारंटी नहीं है। परिणाम नुकसान के प्रकार और सीमा पर निर्भर करता है।' },
      { question: 'क्या हर खराब PDF recover हो जाएगी?', answer: 'नहीं। कुछ फ़ाइलें बहुत अधिक क्षतिग्रस्त या असमर्थित हो सकती हैं।' },
      { question: 'PDF repair करने के बाद क्या जाँचें?', answer: 'डाउनलोड की गई फ़ाइल खोलें और उपयोग या साझा करने से पहले उसके पेज और सामग्री जाँचें।' },
    ],
    related: ['compress', 'merge', 'split'],
  },
  edit: {
    heading: 'PDF फ़ाइल ऑनलाइन एडिट करें',
    intro: 'Docs Are Easy से PDF दस्तावेज़ों में साधारण बदलाव करें। उपलब्ध editing tools से टेक्स्ट, इमेज और shapes जोड़ें और अपडेट किया हुआ दस्तावेज़ डाउनलोड करें।',
    howTo: [
      'Edit PDF खोलें और दस्तावेज़ चुनें।',
      'जिस editing tool का उपयोग करना है उसे चुनें।',
      'दस्तावेज़ में टेक्स्ट, इमेज या shapes जोड़ें।',
      'बदलाव जाँचें और एडिट की गई PDF डाउनलोड करें।',
    ],
    benefits: [
      'PDF में टेक्स्ट जोड़ें।',
      'उपलब्ध tools से इमेज और shapes जोड़ें।',
      'दस्तावेज़ में साधारण दृश्य बदलाव करें।',
      'एडिट किया हुआ दस्तावेज़ डाउनलोड करें।',
    ],
    faqs: [
      { question: 'क्या PDF को ऑनलाइन एडिट कर सकते हैं?', answer: 'हाँ। टेक्स्ट, इमेज और shapes जैसे समर्थित तत्व जोड़ने के लिए editing controls का उपयोग करें।' },
      { question: 'क्या PDF में टेक्स्ट जोड़ सकते हैं?', answer: 'हाँ। text tool चुनें और उपलब्ध controls से दस्तावेज़ में टेक्स्ट जोड़ें।' },
      { question: 'क्या PDF में पहले से मौजूद टेक्स्ट बदल सकते हैं?', answer: 'उपलब्ध editing tools समर्थित नए तत्व जोड़ने के लिए हैं। मौजूदा embedded text को बदलना संभव न भी हो।' },
    ],
    related: ['sign', 'watermark', 'redact'],
  },
  forms: {
    heading: 'PDF फ़ॉर्म ऑनलाइन भरें',
    intro: 'Docs Are Easy से समर्थित interactive PDF फ़ॉर्म भरें। ब्राउज़र में उपलब्ध form fields में जानकारी दर्ज करें और पूरा दस्तावेज़ डाउनलोड करें।',
    howTo: [
      'PDF Forms खोलें और PDF फ़ॉर्म चुनें।',
      'उपलब्ध interactive form fields पर क्लिक करें।',
      'समर्थित fields में ज़रूरी जानकारी दर्ज करें।',
      'भरा हुआ PDF डाउनलोड करें।',
    ],
    benefits: [
      'समर्थित interactive PDF form fields भरें।',
      'ब्राउज़र में दस्तावेज़ फ़ॉर्म पूरे करें।',
      'भरे हुए फ़ॉर्म को जाँच या सबमिशन के लिए तैयार करें।',
      'पूरा दस्तावेज़ डाउनलोड करें।',
    ],
    faqs: [
      { question: 'PDF फ़ॉर्म कैसे भरें?', answer: 'PDF फ़ॉर्म खोलें, समर्थित interactive fields में जानकारी दर्ज करें और पूरा दस्तावेज़ डाउनलोड करें।' },
      { question: 'क्या हर PDF फ़ॉर्म भरा जा सकता है?', answer: 'टूल interactive PDF form fields को सपोर्ट करता है। कुछ flat, scanned या असमर्थित फ़ॉर्म एडिट नहीं हो सकते।' },
      { question: 'क्या भरा हुआ PDF फ़ॉर्म सेव कर सकते हैं?', answer: 'समर्थित fields भरने के बाद पूरा PDF डाउनलोड करें।' },
    ],
    related: ['sign', 'edit', 'protect'],
  },
  pdf2md: {
    heading: 'PDF को ऑनलाइन Markdown में बदलें',
    intro: 'Docs Are Easy से PDF दस्तावेज़ों का टेक्स्ट निकालकर Markdown में बदलें। नोट्स, तकनीकी दस्तावेज़ और Markdown लेखन में निकाले गए टेक्स्ट का दोबारा उपयोग करें।',
    howTo: [
      'PDF to Markdown खोलें और PDF चुनें।',
      'टेक्स्ट निकालने और बदलने की प्रक्रिया शुरू करें।',
      'बने हुए Markdown content की जाँच करें।',
      'उपलब्ध विकल्पों से content डाउनलोड या कॉपी करें।',
    ],
    benefits: [
      'PDF दस्तावेज़ों से टेक्स्ट निकालें।',
      'निकाले गए content को Markdown में बदलें।',
      'Markdown workflows में दस्तावेज़ का टेक्स्ट उपयोग करें।',
      'टेक्स्ट को एडिट और documentation के लिए तैयार करें।',
    ],
    faqs: [
      { question: 'PDF को Markdown में कैसे बदलें?', answer: 'PDF चुनें और conversion प्रक्रिया शुरू करें। बने हुए Markdown output की जाँच करें।' },
      { question: 'क्या PDF to Markdown मूल layout सुरक्षित रखता है?', answer: 'टेक्स्ट extraction और Markdown conversion से जटिल page layouts, columns, tables या visual formatting बिल्कुल वैसी नहीं रह सकती।' },
      { question: 'क्या scanned PDF को बदल सकते हैं?', answer: 'Scanned दस्तावेज़ों से टेक्स्ट निकालने के लिए पहले OCR की ज़रूरत हो सकती है। जहाँ उचित हो OCR PDF टूल का उपयोग करें।' },
    ],
    related: ['ocr', 'compare', 'edit'],
  },
  redact: {
    heading: 'PDF में संवेदनशील जानकारी को redact करें',
    intro: 'Docs Are Easy से PDF में चुनी गई संवेदनशील जानकारी को redact करें। साझा करने से पहले प्रोसेस किए गए दस्तावेज़ को ध्यान से जाँचें।',
    howTo: [
      'Redact PDF खोलें और दस्तावेज़ चुनें।',
      'संवेदनशील जानकारी वाले टेक्स्ट या क्षेत्र पहचानें।',
      'उपलब्ध controls से redact किए जाने वाले क्षेत्र चुनें।',
      'Redaction लागू करें, PDF डाउनलोड करें और परिणाम सत्यापित करें।',
    ],
    benefits: [
      'PDF में चुनी गई संवेदनशील जानकारी छिपाएँ।',
      'साझा करने से पहले दस्तावेज़ तैयार करें।',
      'उपलब्ध controls से चुने हुए क्षेत्रों को redact करें।',
      'दस्तावेज़ बाँटने से पहले परिणाम जाँचें।',
    ],
    faqs: [
      { question: 'PDF redact करने का क्या अर्थ है?', answer: 'Redaction का अर्थ है चुनी गई संवेदनशील जानकारी को स्थायी रूप से हटाना या छिपाना, ताकि साझा दस्तावेज़ में वह दिखाई न दे।' },
      { question: 'क्या टेक्स्ट पर काला shape लगाना redaction के समान है?', answer: 'नहीं। केवल ऊपर से लगाया गया shape मूल टेक्स्ट को उपलब्ध छोड़ सकता है। वास्तविक redaction सुविधा का उपयोग करें और बनी हुई फ़ाइल जाँचें।' },
      { question: 'PDF redact करने के बाद क्या जाँचना चाहिए?', answer: 'साझा करने से पहले जाँचें कि संवेदनशील जानकारी दिखाई नहीं दे रही और extract भी नहीं की जा सकती।' },
    ],
    related: ['protect', 'edit', 'sign'],
  },
  compare: {
    heading: 'दो PDF फ़ाइलों की ऑनलाइन तुलना करें',
    intro: 'Docs Are Easy से दो PDF दस्तावेज़ों की तुलना करके उनके अलग-अलग हिस्सों की जाँच करें। अपडेट की गई फ़ाइल स्वीकार करने या साझा करने से पहले बदलाव पहचानने में मदद लें।',
    howTo: [
      'Compare PDF खोलें और पहली PDF चुनें।',
      'तुलना के लिए दूसरी PDF चुनें।',
      'तुलना प्रक्रिया शुरू करें।',
      'टूल द्वारा पहचाने गए अंतर जाँचें।',
    ],
    benefits: [
      'दो PDF दस्तावेज़ों की तुलना करें।',
      'दस्तावेज़ के अलग-अलग versions में बदलाव जाँचें।',
      'अपडेट किया हुआ दस्तावेज़ साझा करने से पहले बदलाव देखें।',
      'ब्राउज़र-आधारित comparison प्रक्रिया का उपयोग करें।',
    ],
    faqs: [
      { question: 'दो PDF फ़ाइलों की तुलना कैसे करें?', answer: 'Comparison tool में दोनों PDF दस्तावेज़ चुनें और तुलना प्रक्रिया शुरू करें।' },
      { question: 'क्या दस्तावेज़ के अलग-अलग versions की तुलना कर सकते हैं?', answer: 'हाँ। यह टूल दो PDF versions की तुलना करके अंतर पहचानने में मदद करता है।' },
      { question: 'क्या हर visual difference पहचाना जाएगा?', answer: 'परिणाम दस्तावेज़ की सामग्री और टूल की समर्थित comparison विधि पर निर्भर करते हैं। महत्वपूर्ण बदलावों के लिए दोनों दस्तावेज़ स्वयं भी जाँचें।' },
    ],
    related: ['merge', 'pdf2md', 'ocr'],
  },
  ocr: {
    heading: 'OCR से scanned PDF को searchable बनाएँ',
    intro: 'Docs Are Easy से समर्थित scanned PDF दस्तावेज़ों में OCR द्वारा टेक्स्ट पहचानें। पेज इमेज से पहचाना गया टेक्स्ट निकालें ताकि सामग्री खोजी या दोबारा उपयोग की जा सके।',
    howTo: [
      'OCR PDF खोलें और scanned दस्तावेज़ चुनें।',
      'उपलब्ध सेटिंग्स से OCR प्रक्रिया शुरू करें।',
      'टूल द्वारा scanned पेजों का टेक्स्ट पहचानने तक प्रतीक्षा करें।',
      'पहचाने गए टेक्स्ट या तैयार output की जाँच करें और उपयोग करें।',
    ],
    benefits: [
      'समर्थित scanned PDF पेजों से टेक्स्ट पहचानें।',
      'दस्तावेज़ की इमेज से टेक्स्ट निकालें।',
      'Scanned सामग्री को खोजना और दोबारा उपयोग करना आसान बनाएँ।',
      'पहचाने गए टेक्स्ट की शुद्धता जाँचें।',
    ],
    faqs: [
      { question: 'PDF में OCR क्या होता है?', answer: 'OCR का पूरा नाम Optical Character Recognition है। यह scanned page images में टेक्स्ट पहचानकर उसे machine-readable text में बदलता है।' },
      { question: 'क्या OCR scanned PDF को searchable बना सकता है?', answer: 'OCR समर्थित scanned दस्तावेज़ों में टेक्स्ट पहचान सकता है। Searchability टूल द्वारा तैयार किए गए output पर निर्भर करती है।' },
      { question: 'क्या OCR हमेशा सही परिणाम देता है?', answer: 'नहीं। परिणाम image quality, handwriting, भाषा, fonts और दस्तावेज़ की स्थिति पर निर्भर करते हैं। पहचाने गए टेक्स्ट की जाँच करें।' },
    ],
    related: ['scan', 'pdf2md', 'imgpdf'],
  },
  protect: {
    heading: 'PDF फ़ाइल को पासवर्ड से सुरक्षित करें',
    intro: 'Docs Are Easy से PDF में password protection जोड़ें। टूल द्वारा समर्थित password settings का उपयोग करके साझा करने से पहले दस्तावेज़ सुरक्षित करें।',
    howTo: [
      'Protect PDF खोलें और दस्तावेज़ चुनें।',
      'उपलब्ध सेटिंग्स में पासवर्ड दर्ज करें।',
      'PDF पर password protection लागू करें।',
      'सुरक्षित दस्तावेज़ डाउनलोड करें और पासवर्ड सुरक्षित रखें।',
    ],
    benefits: [
      'PDF में password protection जोड़ें।',
      'दस्तावेज़ को अधिक नियंत्रित तरीके से साझा करने के लिए तैयार करें।',
      'उपलब्ध protection settings का उपयोग करें।',
      'ब्राउज़र में दस्तावेज़ प्रोसेस करें।',
    ],
    faqs: [
      { question: 'PDF को पासवर्ड से सुरक्षित कैसे करें?', answer: 'PDF चुनें, protection tool में पासवर्ड दर्ज करें और तैयार दस्तावेज़ डाउनलोड करें।' },
      { question: 'PDF का पासवर्ड भूल जाएँ तो क्या होगा?', answer: 'आप सुरक्षित दस्तावेज़ खोल नहीं पाएँगे। पासवर्ड का सुरक्षित रिकॉर्ड रखें।' },
      { question: 'क्या password protection पूरी सुरक्षा की गारंटी देता है?', answer: 'Password protection सुरक्षा की एक अतिरिक्त परत देता है, लेकिन संवेदनशील फ़ाइलों और पासवर्ड को सावधानी से संभालना भी ज़रूरी है।' },
    ],
    related: ['unlock', 'redact', 'sign'],
  },
  unlock: {
    heading: 'पासवर्ड से PDF अनलॉक करें',
    intro: 'जब आपके पास अनुमति और सही पासवर्ड हो, तब PDF से password protection हटाएँ। Docs Are Easy से समर्थित सुरक्षित दस्तावेज़ों को ब्राउज़र में प्रोसेस करें।',
    howTo: [
      'Unlock PDF खोलें और password-protected दस्तावेज़ चुनें।',
      'माँगे जाने पर सही पासवर्ड दर्ज करें।',
      'Unlock प्रक्रिया शुरू करें।',
      'तैयार PDF डाउनलोड करें और जाँचें कि वह सही से खुलती है।',
    ],
    benefits: [
      'समर्थित password-protected PDF प्रोसेस करें।',
      'दस्तावेज़ अनलॉक करने के लिए आवश्यक पासवर्ड का उपयोग करें।',
      'अनुमति होने पर उपयोग योग्य कॉपी तैयार करें।',
      'ब्राउज़र में फ़ाइलों पर काम करें।',
    ],
    faqs: [
      { question: 'PDF को अनलॉक कैसे करें?', answer: 'Password-protected PDF चुनें, उसका सही पासवर्ड दर्ज करें और टूल से दस्तावेज़ प्रोसेस करें।' },
      { question: 'क्या पासवर्ड के बिना PDF अनलॉक कर सकते हैं?', answer: 'यह टूल समर्थित दस्तावेज़ों के लिए पासवर्ड माँगता है। इसका उद्देश्य access controls को bypass करना नहीं है।' },
      { question: 'क्या PDF अनलॉक करना कानूनी है?', answer: 'केवल उन्हीं दस्तावेज़ों को अनलॉक करें जिनके आप मालिक हैं या जिनके लिए आपको मालिक की अनुमति मिली है।' },
    ],
    related: ['protect', 'sign', 'forms'],
  },
};
