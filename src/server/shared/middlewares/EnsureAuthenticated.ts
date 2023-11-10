import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";



export const ensureAuthenticated: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      erros: {default:'Nao autenticado'}
    });
  };

  const [type, token] = authorization.split(' ')

  if (type !== 'Bearer') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      erros: {default:'Nao autenticado'}
    });
  };

  if (token !== 'teste.teste.teste') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      erros: {default:'Nao autenticado'}
    });
  };

  return next();
};
