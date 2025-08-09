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
    pgm.createTable('locais', {
        id_local: {
            type: 'serial',
            primaryKey: true,
            notNull: true
        },
        local: {
            type: 'varchar(100)',
            notNull: true
        },
        descricao: {
            type: 'text',
            notNull: true
        },
        capacidade: {
            type: 'integer',
            notNull: true
        },
        ativo: {
            type: 'boolean',
            notNull: true,
            default: false
        },
        created_at: {
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
    pgm.dropTable('locais')
};
