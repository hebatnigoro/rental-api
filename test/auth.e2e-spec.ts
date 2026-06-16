import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * E2E test untuk alur autentikasi & JWT token.
 * Yang dicek:
 *  - register & login mengembalikan accessToken
 *  - endpoint yang diproteksi menolak request tanpa token (401)
 *  - endpoint yang diproteksi menolak token ngaco (401)
 *  - endpoint yang diproteksi menerima token yang valid (200)
 */
describe('Auth & JWT (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  // email unik tiap run biar tidak bentrok dengan data sebelumnya
  const testUser = {
    email: `tester_${Date.now()}@mail.com`,
    password: 'password123',
    name: 'Tester E2E',
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/register -> mengembalikan accessToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('POST /api/auth/login -> mengembalikan accessToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken;
  });

  it('POST /api/auth/login dengan password salah -> 401', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'salah-banget' })
      .expect(401);
  });

  it('GET /api/auth/profile tanpa token -> 401', async () => {
    await request(app.getHttpServer()).get('/api/auth/profile').expect(401);
  });

  it('GET /api/auth/profile dengan token ngaco -> 401', async () => {
    await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer token-ngaco')
      .expect(401);
  });

  it('GET /api/auth/profile dengan token valid -> 200', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.email).toBe(testUser.email);
  });

  it('GET /api/customers tanpa token -> 401', async () => {
    await request(app.getHttpServer()).get('/api/customers').expect(401);
  });

  it('GET /api/customers dengan token valid -> 200', async () => {
    await request(app.getHttpServer())
      .get('/api/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
