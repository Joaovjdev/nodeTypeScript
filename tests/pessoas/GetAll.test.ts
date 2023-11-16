import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('People - GetAll', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'getall-people@gmail.com';
    await testServer.post('/register').send({ email, password: '123456', name: 'Teste' });
    const signInRes = await testServer.post('/login').send({ email, password: '123456' });

    accessToken = signInRes.body.accessToken;
  });

  let cityId: number | undefined = undefined;
  beforeAll(async () => {
    const resCity = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ name: 'Teste' });

    cityId = resCity.body;
  });

  it('Try to query without using an authentication token', async () => {
    const res1 = await testServer
      .get('/people')
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Search records', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        email: 'jucagetall@gmail.com',
        name: 'Juca silva',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resSearched = await testServer
      .get('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(Number(resSearched.header['x-total-count'])).toBeGreaterThan(0);
    expect(resSearched.statusCode).toEqual(StatusCodes.OK);
    expect(resSearched.body.length).toBeGreaterThan(0);
  });
});