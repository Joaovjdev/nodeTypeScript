import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Users - SignIn', () => {
  beforeAll(async () => {
    await testServer.post('/register').send({
      name: 'Jorge',
      password: '123456',
      email: 'jorge@gmail.com',
    });
  });

  it('Log in', async () => {
    const res1 = await testServer
      .post('/login')
      .send({
        password: '123456',
        email: 'jorge@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body).toHaveProperty('accessToken');
  });
  it('Wrong password', async () => {
    const res1 = await testServer
      .post('/login')
      .send({
        password: '1234567',
        email: 'jorge@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Email errado', async () => {
    const res1 = await testServer
      .post('/login')
      .send({
        password: '123456',
        email: 'jorgeeeeeee@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Invalid email format', async () => {
    const res1 = await testServer
      .post('/login')
      .send({
        password: '123456',
        email: 'jorge gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
  it('password too small', async () => {
    const res1 = await testServer
      .post('/login')
      .send({
        password: '12',
        email: 'jorge@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });
  it('Password not provided', async () => {
    const res1 = await testServer
      .post('/login')
      .send({
        email: 'jorge@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });
  it('Not informed email', async () => {
    const res1 = await testServer
      .post('/login')
      .send({
        password: '123456',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
});