import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import {AnyObject, Maybe, ObjectSchema, ValidationError} from 'yup';

type TPropety = 'body'| 'header'| 'params'| 'query';

type TGetObjectSchema = <T extends Maybe<AnyObject>>(ObjectSchema: ObjectSchema<T> ) => ObjectSchema<T> 

type TAllObjectSchemas = Record<TPropety, ObjectSchema<any>>;

type TGetAllObjectSchemas = (getObjectSchema: TGetObjectSchema) => Partial<TAllObjectSchemas>;

type TValiantion = (getAllObjectSchemas: TGetAllObjectSchemas) => RequestHandler;

export const validation: TValiantion = (getAllObjectSchemas) => async (req, res, next) => {
  const ObjectSchemas = getAllObjectSchemas((ObjectSchema) => ObjectSchema);

  const errorsResult: Record<string, Record<string, string>> = {};

  Object.entries(ObjectSchemas).forEach(([key, ObjectSchema]) => {
    try {
      ObjectSchema.validateSync(req[key as TPropety], { abortEarly: false });
    }catch (err){
      const yupError = err as ValidationError;
      const errors: Record<string, string> = {};
  
      yupError.inner.forEach(error => {
        if (error.path === undefined) return;
        errors[error.path] = error.message;
      });

      errorsResult[key] = errors;
  
      
    }

  });

if(Object.entries(errorsResult).length === 0){
  return next();
}else {
  return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult });
}

};
