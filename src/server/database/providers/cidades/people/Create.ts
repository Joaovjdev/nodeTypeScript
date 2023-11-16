import { ETableNames } from "../../../ETableNames";
import { Knex } from "../../../knex";
import { IPeople } from "../../../models";



export const create = async (person: Omit<IPeople, 'id'>): Promise<number | Error> => {
  try {
    const [{ count }] = await Knex(ETableNames.city)
      .where('id', '=', person.cityId)
      .count<[{ count: number }]>('* as count');

    if (count === 0) {
      return new Error('The city used in the registration was not found');
    }


    const [result] = await Knex(ETableNames.person).insert(person).returning('id');
    if (typeof result === 'object') {
      return result.id;
    } else if (typeof result === 'number') {
      return result;
    }

    return new Error('Error when registering the record');
  } catch (error) {
    console.log(error);
    return new Error('Error when registering the record');
  }
};