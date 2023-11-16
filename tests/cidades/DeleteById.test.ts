import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Cities - DeleteById', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'deletebuid-cidades@gmail.com';
    await testServer.post('/register').send({ email, password: '123456', name: 'Teste' });
    const signInRes = await testServer.post('/login').send({ email, password: '123456' });

    accessToken = signInRes.body.accessToken;
  });


  it('Try to cancel registration without using authentication token', async () => {
    const res1 = await testServer
      .delete('/cities/1')
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Delete record', async () => {

    const res1 = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ name: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resOff = await testServer
      .delete(`/cities/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resOff.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it('Try to delete a record that doesnt exist', async () => {

    const res1 = await testServer
      .delete('/cities/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});