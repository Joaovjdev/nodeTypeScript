import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Cities - Create', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'create-cities@gmail.com';
    await testServer.post('/register').send({ name: 'Test', email, password: '123456' });
    const signInRes = await testServer.post('/login').send({ email, password: '123456' });

    accessToken = signInRes.body.accessToken;
  });


  it('Attempts to create a record without an access token', async () => {
    const res1 = await testServer
      .post('/cities')
      .send({ name: 'Caxias do Sul' });

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Create record', async () => {
    const res1 = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ name: 'Caxias do Sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  it('Try creating a record with a very short name', async () => {
    const res1 = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ name: 'Ca' });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });
});