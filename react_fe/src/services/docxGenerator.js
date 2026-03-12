import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ImageRun, Header, Footer, PageNumber, Tab } from "docx";
import { saveAs } from "file-saver";

/**
 * Helper to capitalize the initial of a string (matches frontend logic)
 */
const capitalizeInitial = (str) => {
  str = String(str || "");
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generates and downloads a DOCX version of the resume.
 * This implementation is browser-compatible and mirrors the React UI layout.
 */
export const generateAndDownloadResume = async (data) => {
  console.log("[docxGenerator] Starting DOCX generation with data:", data);

  // Fetch the logo to embed it - use the Maveric logo as requested
  let logoImage;
  const logoUrl = window.location.origin + "/frontend/assets/Maveric_Systems_Logo.jpg";
  console.log("[docxGenerator] Attempting to fetch Maveric logo from:", logoUrl);
  try {
    const response = await fetch(logoUrl);
    if (response.ok) {
      logoImage = await response.arrayBuffer();
      console.log("[docxGenerator] Logo loaded successfully. Bytes:", logoImage.byteLength);
    } else {
      console.warn("[docxGenerator] Logo fetch failed with status:", response.status);
    }
  } catch (e) {
    console.error("[docxGenerator] Critical error loading logo image:", e);
  }

  // --- Header Construction (STABLE FLAT LAYOUT - NO NESTING) ---
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      // Row 1: Logo
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnSpan: 2,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              logoImage ? new Paragraph({
                children: [
                  new ImageRun({
                    data: logoImage,
                    transformation: { width: 160, height: 45 },
                  }),
                ],
                spacing: { after: 200 },
              }) : new Paragraph({ text: "", spacing: { after: 200 } }),
            ],
          }),
        ],
      }),
      // Row 2: Name (Left with Blue Bar) and Position (Right) - FLAT ROW, NO NESTED TABLE
      new TableRow({
        children: [
          // Candidate Name + Blue Bar
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.SINGLE, size: 24, color: "0056D2" }, // Royal Blue Sidebar
              right: { style: BorderStyle.NONE },
            },
            margins: { left: 120 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.Headers?.candidateName || "Candidate Name",
                    color: "444444",
                    size: 28,
                    font: "Calibri",
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
          // Candidate Position
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: data.Headers?.candidatePosition || "Candidate Position",
                    color: "666666",
                    size: 24,
                    font: "Calibri",
                  }),
                ],
                spacing: { before: 40 },
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const children = [];

  // --- Professional Summary ---
  if (data.professionalSummary) {
    children.push(createSectionHeader("Professional Summary"));
    children.push(new Paragraph({
      children: [
        new TextRun({
          text: data.professionalSummary,
          size: 22,
          font: "Calibri",
        })
      ],
      spacing: { before: 120, after: 200, line: 240 },
      alignment: AlignmentType.JUSTIFY
    }));
  }

  // --- Professional Experience ---
  if (data.professionalExperience?.length > 0) {
    children.push(createSectionHeader("Professional Experience"));
    data.professionalExperience.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp,
              size: 22,
              font: "Calibri",
            })
          ],
          bullet: { level: 0 },
          spacing: { before: 60, after: 120, line: 240 },
        })
      );
    });
  }

  // --- Non-Project Sections (Order matching webpage) ---
  const sectionGroups = [
    { key: "awards", title: "Awards & Recognitions" },
    { key: "certifications", title: "Certifications and Courses" },
    { key: "education", title: "Educational Qualification" },
    { key: "miscellaneous", title: "Additional Information" }
  ];

  sectionGroups.forEach(sec => {
    if (data[sec.key]?.length > 0) {
      children.push(createSectionHeader(sec.title));
      data[sec.key].forEach((item) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: item, size: 22, font: "Calibri" })],
          bullet: { level: 0 },
          spacing: { before: 60, after: 120, line: 240 }
        }));
      });
    }
  });

  // --- Credits (Matching webpage order) ---
  if (data.credits?.length > 0) {
    children.push(createSectionHeader("Credits"));
    const creditTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      margins: { top: 150, bottom: 150, left: 150, right: 150 },
      rows: data.credits.map(credit => new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: "F5F5F5" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: credit.category, bold: true, size: 22, font: "Calibri" })],
                spacing: { before: 60, after: 60, line: 240 }
              })
            ]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({
                  text: Array.isArray(credit.items) ? credit.items.join(", ") : credit.items,
                  size: 22,
                  font: "Calibri",
                })],
                spacing: { before: 60, after: 60, line: 240 }
              })
            ]
          })
        ]
      })),
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
        left: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
      },
    });
    children.push(creditTable);
    children.push(new Paragraph({ text: "", spacing: { after: 300 } }));
  }

  // --- Project Experience (Moved to end as per webpage order) ---
  if (data.projectExperience?.length > 0) {
    children.push(createSectionHeader("Project Experience"));

    data.projectExperience.forEach((proj) => {
      const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        margins: { top: 150, bottom: 150, left: 150, right: 150 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                shading: { fill: "F5F5F5" },
                children: (proj.projectDetails || []).map(detail =>
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${capitalizeInitial(detail.key)}: `, bold: true, size: 22, font: "Calibri" }),
                      new TextRun({ text: capitalizeInitial(detail.value), size: 22, font: "Calibri" }),
                    ],
                    spacing: { before: 60, after: 60, line: 240 }
                  })
                ),
              }),
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                children: [
                  ...(proj.description ? [
                    new Paragraph({
                      children: [new TextRun({ text: "Description:", bold: true, size: 22, font: "Calibri" })],
                      spacing: { before: 40, line: 240 }
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: proj.description, size: 22, font: "Calibri" })],
                      spacing: { before: 40, after: 120, line: 240 },
                      alignment: AlignmentType.JUSTIFY
                    }),
                  ] : []),
                  ...(proj.responsibilities?.length > 0 ? [
                    new Paragraph({
                      children: [new TextRun({ text: "Responsibilities:", bold: true, size: 22, font: "Calibri" })],
                      spacing: { before: 40, line: 240 }
                    }),
                    ...proj.responsibilities.map(resp =>
                      new Paragraph({
                        children: [new TextRun({ text: resp, size: 22, font: "Calibri" })],
                        bullet: { level: 0 },
                        spacing: { before: 40, after: 60, line: 240 }
                      })
                    ),
                  ] : []),
                ],
              }),
            ],
          }),
        ],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
          left: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
          right: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
          insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "444444" },
        },
      });
      children.push(table);
      children.push(new Paragraph({ text: "", spacing: { after: 300 } }));
    });
  }


  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 720,
            right: 720,
            bottom: 720,
            left: 720,
          }
        }
      },
      headers: {
        default: new Header({
          children: [headerTable],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Confidential",
                  italics: true,
                  size: 18,
                  font: "Calibri",
                }),
                new Tab(),
                new TextRun({
                  text: "Page ",
                  size: 18,
                  font: "Calibri",
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  size: 18,
                  font: "Calibri",
                }),
                new TextRun({
                  text: " of ",
                  size: 18,
                  font: "Calibri",
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  size: 18,
                  font: "Calibri",
                }),
              ],
            }),
          ],
        }),
      },
      children: children,
    }],
  });

  try {
    console.log("[docxGenerator] Document built. Packing to blob...");
    const blob = await Packer.toBlob(doc);
    const fileName = `${data.Headers?.candidateName?.replace(/\s+/g, "_") || "Resume"}_Standardized.docx`;
    saveAs(blob, fileName);
    console.log("[docxGenerator] Download successfully triggered on frontend.");
  } catch (error) {
    console.error("[docxGenerator] Critical error during docx generation:", error);
    throw error;
  }
};

/** 
 * MAXIMUM STABILITY Section Headers (Table-based bars)
 */
function createSectionHeader(title) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: "DFDFDF" },
            margins: { top: 100, bottom: 100, left: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: title.toUpperCase(),
                    bold: true,
                    size: 24,
                    font: "Calibri",
                  })
                ],
              })
            ],
          }),
        ],
      }),
    ],
  });
}




