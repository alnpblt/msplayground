#!/bin/bash

read -p "Filename: `echo $'\n>> '`" filename
fileVar="`date +%Y%m%d%H%M%S`-$filename.ts"
# eval "touch $fileVar && code -r $fileVar"
# echo -e "'use strict';" >> $fileVar 
template="import { QueryInterface } from 'sequelize';
import { DataType, Sequelize } from 'sequelize-typescript';

const table = '';
const tableSchema = {};
const columns = {};
const indexes = [];

const addIndex = async (queryInterface: QueryInterface, indexTable: string, indexObject: any[]) => {
  if (!Array.isArray(indexObject)) {
    return;
  }

  await Promise.all(
    indexObject.map(async (index) => {
      await queryInterface.addIndex(indexTable, index.fields, index);
    }),
  );
};

const removeIndex = async (queryInterface: QueryInterface, indexTable: string, indexObject: any[]) => {
  if (!Array.isArray(indexObject)) {
    return;
  }

  await Promise.all(
    indexObject.map(async (index) => {
      await queryInterface.removeIndex(indexTable, index.name);
    }),
  );
};

const addColumn = async (queryInterface: QueryInterface, columnTable: string, columnObject: Record<string, any>) => {
  if (typeof columnObject !== 'object') {
    return;
  }

  await Promise.all(
    Object.keys(columnObject).map(async (column) => {
      await queryInterface.addColumn(columnTable, column, columnObject[column]);
    }),
  );
};

const removeColumn = async (queryInterface: QueryInterface, columnTable: string, columnObject: Record<string, any>) => {
  if (typeof columnObject !== 'object') {
    return;
  }

  await Promise.all(
    Object.keys(columnObject).map(async (column) => {
      await queryInterface.removeColumn(columnTable, column, columnObject[column]);
    }),
  );
};

export default {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    // snippet for creating table
    if (Object.keys(tableSchema).length !== 0) {
      await queryInterface.createTable(table, tableSchema);
    }

    // snippet for adding columns
    await addColumn(queryInterface, table, columns);

    // snippet for adding indexes)
    await addIndex(queryInterface, table, indexes);
  },
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    // snippet for removing table
    if (Object.keys(tableSchema).length !== 0) {
      await queryInterface.dropTable(table);
    }

    // snippet for removing column
    await removeColumn(queryInterface, table, columns);

    // snippet for removing index
    await removeIndex(queryInterface, table, indexes);
  },
};

"

echo -e "$template" >> $fileVar
eval "code -r $fileVar"
exit

