import { ETableNames } from "../../../ETableNames";
import { Knex } from "../../../knex";
import { IPeople } from "../../../models";


export const getById = async (id: number): Promise<IPeople | Error> => {
  try {
    const result = await Knex(ETableNames.person)
      .select('*')
      .where('id', '=', id)
      .first();

    if (result) return result;

    return new Error('Register not found');
  } catch (error) {
    console.log(error);
    return new Error('Error when querying the registry');
  }
};