import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Cities - GetAll', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'getall-cities@gmail.com';
    await testServer.post('/register').send({ email, password: '123456', name: 'Teste' });
    const signInRes = await testServer.post('/login').send({ email, password: '123456' });

    accessToken = signInRes.body.accessToken;
  });


  it('Try querying without using authentication token', async () => {
    const res1 = await testServer
      .get('/cities')
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Search all records', async () => {

    const res1 = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resSearched = await testServer
      .get('/cities')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(Number(resSearched.header['x-total-count'])).toBeGreaterThan(0);
    expect(resSearched.statusCode).toEqual(StatusCodes.OK);
    expect(resSearched.body.length).toBeGreaterThan(0);
  });
});