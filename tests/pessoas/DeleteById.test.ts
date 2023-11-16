import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('People - DeleteById', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'delete-people@gmail.com';
    await testServer.post('/register').send({ email, password: '123456', name: 'Teste' });
    const signInRes = await testServer.post('/login').send({ email, password: '123456' });

    accessToken = signInRes.body.accessToken;
  });

  let cityId: number | undefined = undefined;
  beforeAll(async () => {
    const resCity = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ name: 'Test' });

    cityId = resCity.body;
  });

  it('Try to cancel registration without using authentication token', async () => {
    const res1 = await testServer
      .delete('/people/1')
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Delete record', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        email: 'jucadelete@gmail.com',
        name: 'Juca silva',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resApagada = await testServer
      .delete(`/people/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(resApagada.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it('Try to delete a record that doesnt exist', async () => {
    const res1 = await testServer
      .delete('/people/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});