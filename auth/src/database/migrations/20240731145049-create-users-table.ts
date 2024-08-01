import { QueryInterface } from "sequelize";
import { DataType, Sequelize } from "sequelize-typescript";

const table = 'users';
const tableSchema = {
  id: {
    autoIncrement: true,
    type: DataType.INTEGER,
    primaryKey: true,
  },
  first_name: {
    type: DataType.STRING(150),
  },
  last_name: {
    type: DataType.STRING(150),
  },
  email: {
    type: DataType.STRING(150),
  },
  password: {
    type: DataType.STRING(100),
  },
  created_at: {
    type: DataType.DATE,
  },
  updated_at: {
    type: DataType.DATE,
  },
  deleted_at: {
    type: DataType.DATE,
  },
};
const columns = {};
const indexes = [
  {
    name: 'users_email',
    using: 'BTREE',
    fields: [{ name: 'email' }],
  },
];

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
