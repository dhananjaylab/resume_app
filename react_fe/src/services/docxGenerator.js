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
 * Removes XML-incompatible control characters.
 * Matches the logic in the backend docx_service.py.
 */
const sanitizeText = (text) => {
  if (typeof text !== "string") return text;
  // Remove control characters except for \t, \n, \r
  // Regex removes: ([\x00-\x08\x0B\x0C\x0E-\x1F\x7F])
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
};

/**
 * Generates and downloads a DOCX version of the resume.
 * This implementation is browser-compatible and mirrors the React UI layout.
 */
export const generateAndDownloadResume = async (data) => {
  console.log("[docxGenerator] Starting DOCX generation with data:", data);

  // --- Header Construction (Branded multi-row layout) ---
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
      // Row 2: Branded Blue Line + Name + Position
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [
              new Table({
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
                  new TableRow({
                    children: [
                      // Left part: Blue Bar + Name
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: {
                          left: { style: BorderStyle.SINGLE, size: 24, color: "0056D2" }, // Royal Blue Vertical Bar
                        },
                        margins: { left: 120 },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: sanitizeText(data.Headers?.candidateName || "Candidate Name"),
                                color: "444444",
                                size: 28,
                                font: "Calibri",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                      // Right part: Position
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: sanitizeText(data.Headers?.candidatePosition || "Candidate Position"),
                                color: "666666",
                                size: 24,
                                font: "Calibri",
                              }),
                            ],
                            spacing: { before: 40 }, // Align roughly with name baseline
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new Paragraph({ text: "", spacing: { before: 100 } }), // Mandatory trailing paragraph after table in cell
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
          text: sanitizeText(data.professionalSummary),
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
              text: sanitizeText(exp),
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
          children: [new TextRun({ text: sanitizeText(item), size: 22, font: "Calibri" })],
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
                children: [new TextRun({ text: sanitizeText(credit.category), bold: true, size: 22, font: "Calibri" })],
                spacing: { before: 60, after: 60, line: 240 }
              })
            ]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({
                  text: sanitizeText(Array.isArray(credit.items) ? credit.items.join(", ") : credit.items),
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
                children: (proj.projectDetails || []).length > 0
                  ? (proj.projectDetails || []).map(detail =>
                    new Paragraph({
                      children: [
                        new TextRun({ text: `${capitalizeInitial(detail.key)}: `, bold: true, size: 22, font: "Calibri" }),
                        new TextRun({ text: sanitizeText(capitalizeInitial(detail.value)), size: 22, font: "Calibri" }),
                      ],
                      spacing: { before: 60, after: 60, line: 240 }
                    })
                  )
                  : [new Paragraph({ text: "" })], // Safety
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
                      children: [new TextRun({ text: sanitizeText(proj.description), size: 22, font: "Calibri" })],
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
                        children: [new TextRun({ text: sanitizeText(resp), size: 22, font: "Calibri" })],
                        bullet: { level: 0 },
                        spacing: { before: 40, after: 60, line: 240 }
                      })
                    ),
                  ] : [new Paragraph({ text: "" })]), // Safety
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
      children: children.length > 0 ? children : [new Paragraph({ text: "" })],
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
 * Reverted to Paragraph-based section headers while ensuring structural safety.
 */
function createSectionHeader(title) {
  return new Paragraph({
    shading: { fill: "DFDFDF" },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: 24,
        font: "Calibri",
      })
    ],
    spacing: { before: 400, after: 200 },
  });
}




