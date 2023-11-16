import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('People - Create', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'create-people@gmail.com';
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


  it('Create without using authentication token', async () => {
    const res1 = await testServer
      .post('/people')
      .send({
        cityId: 1,
        email: 'juca@gmail.com',
        name: 'Juca silva',
      });

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Create record', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        email: 'juca@gmail.com',
        name: 'Juca silva',
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  it('Create record 2', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        name: 'Juca silva',
        email: 'juca2@gmail.com',
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  it('Try to create a record with a duplicate email', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        name: 'Juca silva',
        email: 'jucaduplicado@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');

    const res2 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        email: 'jucaduplicado@gmail.com',
        name: 'duplicado',
      });
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toHaveProperty('errors.default');
  });
  it('Trying to create a record with a very short name', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        email: 'juca@gmail.com',
        name: 'Ju',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.name');
  });
  it('Try to create a record without a name', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        email: 'juca@gmail.com',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.name');
  });
  it('Try creating registration without email', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        name: 'Juca da Silva',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
  it('Try creating registration with invalid email', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId,
        email: 'juca gmail.com',
        name: 'Juca da Silva',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
  it('Try to create a record without cityId', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        email: 'juca@gmail.com',
        name: 'Juca da Silva',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cityId');
  });
  it('Attempts to create record with invalid cityId', async () => {
    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cityId: 'test',
        email: 'juca@gmail.com',
        name: 'Juca da Silva',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cityId');
  });
  it('Try creating record without sending any properties', async () => {

    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
    expect(res1.body).toHaveProperty('errors.body.cityId');
    expect(res1.body).toHaveProperty('errors.body.name');
  });
});