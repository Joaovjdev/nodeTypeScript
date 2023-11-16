import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Cities - UpdateById', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'updatebyid-cities@gmail.com';
    await testServer.post('/register').send({ email, password: '123456', name: 'Test' });
    const signInRes = await testServer.post('/login').send({ email, password: '123456' });

    accessToken = signInRes.body.accessToken;
  });


  it('Try updating without using an authentication token', async () => {
    const res1 = await testServer
      .put('/cities/1')
      .send({ name: 'Test' });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Update record', async () => {

    const res1 = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ name: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualizada = await testServer
      .put(`/cities/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ name: 'Caxias' });

    expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it('Trying to update a record that doesnt exist', async () => {

    const res1 = await testServer
      .put('/cities/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ name: 'Caxias' });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});