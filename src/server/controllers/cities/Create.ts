import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { CitiesProvider } from '../../database/providers/cidades';
import { validation } from '../../shared/middlewares';
import { ICities } from '../../database/models';


interface IBodyProps extends Omit<ICities, 'id'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    name: yup.string().required().min(3).max(150),
  })),
}));

export const create = async (req: Request<{}, {}, ICities>, res: Response) => {
  const result = await CitiesProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};