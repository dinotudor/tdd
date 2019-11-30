import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when creating a profile', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Dino Tudor',
        email: 'dino@dino.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Dino Tudor',
        email: 'dino@dino.com',
        password: '123456',
      });
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Dino Tudor',
        email: 'dino@dino.com',
        password: '123456',
      });
    expect(response.status).toBe(400);
  });
});
