import { Request, RequestHandler, Response, query } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup';

import { validation } from "../../shared/middlewares";

interface IParamProps {
  id?: number;

}

export const getByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(yup.object().shape({
    id: yup.number().integer().optional().moreThan(0),
  })),
}));

export const getById = async (req: Request<IParamProps>, res: Response) => {
  
  if(Number(req.params.id) === 99999) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    errors: {
      default: 'Registro nao encontrado'
    }
  });

  return res.status(StatusCodes.OK).json({
    id: req.params.id,
    nome: 'Caxias do Sul',
  });

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Nao implementado!");
}