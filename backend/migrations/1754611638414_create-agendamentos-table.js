/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {{
    pgm.createTable('agendamentos', {
        id_agendamento: {
            type: 'serial',
            primaryKey: true,
            notNull: true
        },
        local: {
            type: 'varchar(100)',
            notNull: true,
            references: 'locais(local)',
            onDelete: 'CASCADE'
        },
        data_inicio: {
            type: 'timestamp with time zone',
            notNull: true
        },
        data_termino: {
            type: 'timestamp with time zone',
            notNull: true
        },
        created_at: {
            type: 'timestamp with time zone',
            default: pgm.func('current_timestamp'),
        }
    })
}};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('agendamentos')
};
