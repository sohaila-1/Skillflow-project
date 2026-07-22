import { CertificateGenerationTask, CertificatePayload } from './certificate-generation.task';

// Declare at module scope so the closure inside jest.mock can reference it at call time
let mockSendMail: jest.Mock;

const { EventEmitter } = require('events') as { EventEmitter: typeof import('events').EventEmitter };

jest.mock('pdfkit', () => {
  const { EventEmitter: EE } = require('events');
  return jest.fn().mockImplementation(() => {
    const emitter = new EE();
    emitter.rect = jest.fn().mockReturnThis();
    emitter.fill = jest.fn().mockReturnThis();
    emitter.stroke = jest.fn().mockReturnThis();
    emitter.lineWidth = jest.fn().mockReturnThis();
    emitter.moveTo = jest.fn().mockReturnThis();
    emitter.lineTo = jest.fn().mockReturnThis();
    emitter.fillColor = jest.fn().mockReturnThis();
    emitter.fontSize = jest.fn().mockReturnThis();
    emitter.font = jest.fn().mockReturnThis();
    emitter.text = jest.fn().mockReturnThis();
    emitter.end = jest.fn(() => {
      emitter.emit('data', Buffer.from('pdf'));
      emitter.emit('end');
    });
    emitter.page = { width: 841, height: 595 };
    return emitter;
  });
});

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: (...args: unknown[]) => mockSendMail(...args),
  })),
}));

const basePayload: CertificatePayload = {
  userId: 'user-1',
  courseId: 'course-1',
  courseTitle: 'Introduction to TypeScript',
  studentName: 'Jane Doe',
  studentEmail: 'jane@example.com',
  score: 8,
  totalQuestions: 10,
  completedAt: '2026-01-01T00:00:00.000Z',
};

describe('CertificateGenerationTask', () => {
  beforeEach(() => {
    mockSendMail = jest.fn().mockResolvedValue({});
  });

  it('returns { userId, courseId, emailSent: true } on success', async () => {
    const result = await CertificateGenerationTask.execute(basePayload);

    expect(result.userId).toBe('user-1');
    expect(result.courseId).toBe('course-1');
    expect(result.emailSent).toBe(true);
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  it('returns { emailSent: false } when nodemailer throws', async () => {
    mockSendMail = jest.fn().mockRejectedValue(new Error('SMTP connection refused'));

    const result = await CertificateGenerationTask.execute(basePayload);

    expect(result.userId).toBe('user-1');
    expect(result.courseId).toBe('course-1');
    expect(result.emailSent).toBe(false);
  });
});
