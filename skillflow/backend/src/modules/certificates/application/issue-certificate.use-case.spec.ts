import { IssueCertificateUseCase, IssueCertificateDto } from './issue-certificate.use-case';
import { CertificateRepositoryPort } from '../domain/certificate.repository.port';
import { Certificate } from '../domain/certificate.entity';

const mockRepo: jest.Mocked<CertificateRepositoryPort> = {
  findByUserAndCourse: jest.fn(),
  findById: jest.fn(),
  findByUser: jest.fn(),
  save: jest.fn(),
  markEmailSent: jest.fn(),
};

describe('IssueCertificateUseCase', () => {
  let useCase: IssueCertificateUseCase;

  const dto: IssueCertificateDto = {
    userId: 'user-1',
    courseId: 'course-1',
    courseTitle: 'Python for Beginners',
    studentName: 'Alice',
    score: 4,
    totalQuestions: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new IssueCertificateUseCase(mockRepo);
  });

  it('creates and returns a new certificate when none exists', async () => {
    mockRepo.findByUserAndCourse.mockResolvedValue(null);
    const created = Object.assign(new Certificate(), { ...dto, id: 'cert-uuid', emailSent: false });
    mockRepo.save.mockResolvedValue(created);

    const result = await useCase.execute(dto);

    expect(mockRepo.save).toHaveBeenCalledWith(dto);
    expect(result.courseTitle).toBe('Python for Beginners');
    expect(result.score).toBe(4);
  });

  it('returns existing certificate without creating a duplicate', async () => {
    const existing = Object.assign(new Certificate(), { ...dto, id: 'cert-existing', emailSent: true });
    mockRepo.findByUserAndCourse.mockResolvedValue(existing);

    const result = await useCase.execute(dto);

    expect(mockRepo.save).not.toHaveBeenCalled();
    expect(result).toBe(existing);
  });

  it('findByUser delegates to the repository', async () => {
    const certs = [
      Object.assign(new Certificate(), { id: 'c1', userId: 'user-1' }),
      Object.assign(new Certificate(), { id: 'c2', userId: 'user-1' }),
    ];
    mockRepo.findByUser.mockResolvedValue(certs);

    const result = await useCase.findByUser('user-1');

    expect(mockRepo.findByUser).toHaveBeenCalledWith('user-1');
    expect(result).toHaveLength(2);
  });

  it('findById delegates to the repository', async () => {
    const cert = Object.assign(new Certificate(), { id: 'cert-uuid', userId: 'user-1' });
    mockRepo.findById.mockResolvedValue(cert);

    const result = await useCase.findById('cert-uuid');

    expect(mockRepo.findById).toHaveBeenCalledWith('cert-uuid');
    expect(result).toBe(cert);
  });

  it('markEmailStatus delegates to the repository', async () => {
    mockRepo.markEmailSent.mockResolvedValue(undefined);

    await useCase.markEmailStatus('user-1', 'course-1', true);

    expect(mockRepo.markEmailSent).toHaveBeenCalledWith('user-1', 'course-1', true);
  });
});
