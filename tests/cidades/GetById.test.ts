import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Cities - GetById', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'getbyid-cities@gmail.com';
    await testServer.post('/register').send({ email, password: '123456', name: 'Teste' });
    const signInRes = await testServer.post('/login').send({ email, password: '123456' });

    accessToken = signInRes.body.accessToken;
  });


  it('Try querying without using authentication token', async () => {
    const res1 = await testServer
      .get('/cities/1')
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Search record by id', async () => {

    const res1 = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ name: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resSearched = await testServer
      .get(`/cities/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resSearched.statusCode).toEqual(StatusCodes.OK);
    expect(resSearched.body).toHaveProperty('name');
  });
  it('Trying to find a record that doesnt exist', async () => {

    const res1 = await testServer
      .get('/cities/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});