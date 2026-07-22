import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import logger from '../../shared/logger';

export type CertificatePayload = {
  userId: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
};

export type CertificateResult = {
  userId: string;
  courseId: string;
  emailSent: boolean;
};

export class CertificateGenerationTask {
  static async execute(payload: unknown): Promise<CertificateResult> {
    const input = payload as CertificatePayload;
    logger.info({ userId: input.userId, courseId: input.courseId }, 'Generating certificate PDF');

    const pdfBuffer = await generatePDF(input);
    const emailSent = await sendEmail(input, pdfBuffer);

    return { userId: input.userId, courseId: input.courseId, emailSent };
  }
}

function generatePDF(input: CertificatePayload): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const percentage = Math.round((input.score / input.totalQuestions) * 100);
    const issuedAt = new Date(input.completedAt).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f5f3ff');

    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3).stroke('#7c3aed');

    // Header
    doc.fillColor('#7c3aed').fontSize(36).font('Helvetica-Bold')
      .text('SkillFlow', 0, 60, { align: 'center' });

    doc.fillColor('#4b5563').fontSize(14).font('Helvetica')
      .text('CERTIFICATE OF COMPLETION', 0, 105, { align: 'center' });

    // Divider
    doc.moveTo(150, 135).lineTo(doc.page.width - 150, 135)
      .lineWidth(1).stroke('#ddd6fe');

    // Body
    doc.fillColor('#1f2937').fontSize(16).font('Helvetica')
      .text('This is to certify that', 0, 160, { align: 'center' });

    doc.fillColor('#111827').fontSize(30).font('Helvetica-Bold')
      .text(input.studentName, 0, 190, { align: 'center' });

    doc.fillColor('#1f2937').fontSize(16).font('Helvetica')
      .text('has successfully completed the course', 0, 240, { align: 'center' });

    doc.fillColor('#7c3aed').fontSize(22).font('Helvetica-Bold')
      .text(input.courseTitle, 0, 270, { align: 'center' });

    // Score
    doc.fillColor('#4b5563').fontSize(14).font('Helvetica')
      .text(`Score: ${input.score}/${input.totalQuestions} (${percentage}%)`, 0, 320, { align: 'center' });

    // Footer
    doc.moveTo(150, 360).lineTo(doc.page.width - 150, 360)
      .lineWidth(1).stroke('#ddd6fe');

    doc.fillColor('#6b7280').fontSize(12).font('Helvetica')
      .text(`Issued on ${issuedAt}`, 0, 375, { align: 'center' });

    doc.end();
  });
}

async function sendEmail(input: CertificatePayload, pdf: Buffer): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'mailpit',
      port: Number(process.env.SMTP_PORT ?? 1025),
      secure: false,
    });

    await transporter.sendMail({
      from: 'noreply@skillflow.io',
      to: input.studentEmail,
      subject: `Your SkillFlow certificate — ${input.courseTitle}`,
      html: `<p>Congratulations <strong>${input.studentName}</strong>!</p>
             <p>You passed <strong>${input.courseTitle}</strong> with a score of
             ${input.score}/${input.totalQuestions}.</p>
             <p>Your certificate is attached.</p>`,
      attachments: [{
        filename: `certificate-${input.courseId}.pdf`,
        content: pdf,
        contentType: 'application/pdf',
      }],
    });

    logger.info({ email: input.studentEmail }, 'Certificate email sent');
    return true;
  } catch (err) {
    logger.error({ err }, 'Failed to send certificate email');
    return false;
  }
}
