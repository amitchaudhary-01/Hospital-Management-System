import PDFDocument from "pdfkit";

export const generatePDFBuffer = (prescription) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    // Header
    doc
      .fontSize(20)
      .fillColor("#0284c7")
      .text("MEDICAL PRESCRIPTION", { align: "center" });
    doc.moveDown(1.5);

    // Doctor & Patient Info
    doc.fontSize(10).fillColor("#334155");

    const doctorName = prescription.doctor?.name
      ? `Dr. ${prescription.doctor.name}`
      : "Doctor";
    doc.text(`Doctor: ${doctorName}`, 50, 110);
    doc.text(
      `Specialty: ${prescription.doctor?.specialty || "General Medicine"}`,
      50,
      125
    );

    const dateStr = new Date(prescription.createdAt).toLocaleDateString();
    doc.text(`Date: ${dateStr}`, 380, 110);
    doc.text(`Patient: ${prescription.patient?.name || "N/A"}`, 380, 125);
    doc.text(
      `Gender/Age: ${prescription.patient?.gender || "N/A"} / ${
        prescription.patient?.age || "N/A"
      }`,
      380,
      140
    );

    doc.moveDown(2);
    doc
      .strokeColor("#cbd5e1")
      .lineWidth(1)
      .moveTo(50, 165)
      .lineTo(550, 165)
      .stroke();

    // Diagnosis
    if (prescription.diagnosis) {
      doc.fontSize(12).fillColor("#0f172a").text("Diagnosis:", 50, 180);
      doc
        .fontSize(10)
        .fillColor("#475569")
        .text(prescription.diagnosis, 50, 195);
    }

    // Medicines Header
    let startY = prescription.diagnosis ? 225 : 180;
    doc
      .fontSize(12)
      .fillColor("#0f172a")
      .text("Prescribed Medicines:", 50, startY);
    startY += 20;

    doc.fontSize(10).fillColor("#0284c7");
    doc.text("Medicine Name", 50, startY, { width: 150 });
    doc.text("Dosage", 210, startY, { width: 80 });
    doc.text("Frequency", 300, startY, { width: 100 });
    doc.text("Duration", 410, startY, { width: 80 });

    startY += 15;
    doc
      .strokeColor("#e2e8f0")
      .lineWidth(0.5)
      .moveTo(50, startY)
      .lineTo(550, startY)
      .stroke();

    // Medicines Table Rows
    doc.fillColor("#334155");
    prescription.medicines?.forEach((med) => {
      startY += 14;
      doc.text(med.name || "-", 50, startY, { width: 150 });
      doc.text(med.dosage || "-", 210, startY, { width: 80 });
      doc.text(med.frequency || "-", 300, startY, { width: 100 });
      doc.text(med.duration || "-", 410, startY, { width: 80 });
    });

    // Advice / Instructions
    if (prescription.advice) {
      startY += 30;
      doc
        .fontSize(12)
        .fillColor("#0f172a")
        .text("Advice / Instructions:", 50, startY);
      doc
        .fontSize(10)
        .fillColor("#475569")
        .text(prescription.advice, 50, startY + 15);
    }

    doc.end();
  });
};