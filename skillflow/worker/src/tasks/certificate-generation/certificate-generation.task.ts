import logger from '../../shared/logger';

export type CertificatePayload = {
  userId: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  completedAt: string;
};

export type CertificateResult = {
  userId: string;
  courseId: string;
  pdfBase64: string;
};

export class CertificateGenerationTask {
  static async execute(payload: unknown): Promise<CertificateResult> {
    const input = payload as CertificatePayload;
    logger.info({ userId: input.userId, courseId: input.courseId }, 'Generating certificate');

    // TODO: Use pdfkit to generate a real PDF
    // Placeholder — returns a base64 stub
    const stub = Buffer.from(`Certificate for ${input.studentName} — ${input.courseTitle}`).toString('base64');

    return {
      userId: input.userId,
      courseId: input.courseId,
      pdfBase64: stub,
    };
  }
}
