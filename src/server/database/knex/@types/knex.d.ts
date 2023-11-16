import { ICities, IPeople, IUsers } from '../../models';

declare module 'knex/types/tables' {
  interface Tables {
    cidade: ICities
    pessoa: IPeople
    usuario: IUsers
  }

}