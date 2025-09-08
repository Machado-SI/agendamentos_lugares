/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'serial',
            primaryKey: true,
        },
        nome: {
            type: 'varchar(100)',
            notNull: true,
        },
        email: {
            type: 'varchar(100)',
            notNull: true,
        },
        senha: {
            type: 'varchar(255)',
            notNull: true,
            unique: true
        },
        create_at: {
            type: 'timestamp with time zone',
            default: pgm.func('current_timestamp'),
        }
    }) 
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('users');
};
