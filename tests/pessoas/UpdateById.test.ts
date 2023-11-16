import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('People - UpdateById', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'updatebyid-people@gmail.com';
    await testServer.post('/cadastrar').send({ email, password: '123456', name: 'Teste' });
    const signInRes = await testServer.post('/entrar').send({ email, password: '123456' });

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

  it('Try to update without using an authentication token', async () => {
    const res1 = await testServer
      .put('/people/1')
      .send({
        cityId: 1,
        email: 'juca@gmail.com',
        name: 'Juca silva',
      });

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Update record', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        name: 'Juca silva',
        email: 'jucaupdate@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resUpdated = await testServer
      .put(`/people/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        name: 'Juca silva',
        email: 'jucaupdates@gmail.com',
      });
    expect(resUpdated.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it('Trying to update a record that doesnt exist', async () => {
    const res1 = await testServer
      .put('/people/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        email: 'juca@gmail.com',
        name: 'Juca silva',
      });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});