import { ETableNames } from "../../../ETableNames";
import { Knex } from "../../../knex";
import { IPeople } from "../../../models";


export const getAll = async (page: number, limit: number, filter: string): Promise<IPeople[] | Error> => {
  try {
    const result = await Knex(ETableNames.person)
      .select('*')
      .where('name', 'like', `%${filter}%`)
      .offset((page - 1) * limit)
      .limit(limit);

    return result;
  } catch (error) {
    console.log(error);
    return new Error('Error when querying records');
  }
};