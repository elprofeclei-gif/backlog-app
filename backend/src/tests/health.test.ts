import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index';

describe('API Health Check', () => {
  it('debe responder con status 200 y mensaje OK', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toBe('Backlog API is running');
  });
});
