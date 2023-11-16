import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { ICities } from "../../models";




export const updateById =async (id: number, city: Omit<ICities, 'id'>): Promise<void | Error> => {
  
  try {
    const result = await Knex(ETableNames.city)
    .update(city)
    .where('id', '=', id);

    if (result > 0) return;
    return new Error('Error updating registry');

  } catch (error) {
    console.log(error);
    
    return new Error('Error updating registry');
  }

}