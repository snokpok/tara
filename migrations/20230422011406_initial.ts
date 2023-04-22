import { Knex } from 'knex';

const artifactTypes = ['QUESTION', 'PROJECT', 'LAB', 'EXAM']; // TODO: more?

export async function up(knex: Knex): Promise<void> {
	return knex.schema
		.createTable('users', (table) => {
			table.increments('id').primary();
			table.string('email').unique();
			table.string('pwdhash');
		})
		.createTable('access_tokens', (table) => {
			table.string('value').primary();
			table.string('user_id').references('id').inTable('users');
		})
		.createTable('classes', (table) => {
			table.increments('id').primary();
			table.integer('owner_id').references('id').inTable('users');
			table.string('name');
		})
		.createTable('artifacts', (t) => {
			t.increments('id').primary();
			t.enu('type', artifactTypes);
			t.string('name');
		})
		.createTable('artifact_trees', (t) => {
			t.integer('parent_id').references('id').inTable('artifacts');
			t.integer('child_id').references('id').inTable('artifacts');
		});
	// .createTable('files', (t) => {
	// 	t.string('key').primary();
	// })
	// .createTable('artifacts_files', (t) => {
	// 	t.integer('artifact_id').references('id').inTable('artifacts');
	// 	t.string('file_id').references('key').inTable('files');
	// });
}

export async function down(knex: Knex): Promise<void> {}
