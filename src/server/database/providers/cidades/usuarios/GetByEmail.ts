import { ETableNames } from "../../../ETableNames";
import { Knex } from "../../../knex";
import { IUsers } from "../../../models";



export const getByEmail = async (email: string): Promise<IUsers | Error> => {
  try {
    const result = await Knex(ETableNames.user)
      .select('*')
      .where('email', '=', email)
      .first();

    if (result) return result;

    return new Error('register not found');
  } catch (error) {
    console.log(error);
    return new Error('Error when querying the registry');
  }
};