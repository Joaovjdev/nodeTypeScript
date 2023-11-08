import { Knex } from 'knex';
import { ETbaleNames } from '../ETableNames';


export async function up(knex: Knex) {
  return knex
  .schema
  .createTable(ETbaleNames.cidade, table => {
    table.bigIncrements('id').primary().index();
    table.string('nome', 150).checkLength('<=', 150).index().notNullable();

    table.comment('Tabela para armazenar cidades do sistema');

  })
  .then(() => {
    console.log(`Create table ${ETbaleNames.cidade}`)
  });
    
}


export async function down(knex: Knex) {
  return knex.schema
  .dropTable(ETbaleNames.cidade)
  .then(() => {
    console.log(`Dropped table ${ETbaleNames.cidade}`)
  });

}

