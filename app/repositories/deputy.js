import db from '#config/db.js';

/*
TODO:
email
website to assemblee nationale
*/

const insertDeputies = async (deputies) => {
  try {
    // Define column mappings
    const columns = new db.$config.pgp.helpers.ColumnSet(
      [
        { name: 'id', prop: 'id' },
        { name: 'firstname', prop: 'firstname' },
        { name: 'lastname', prop: 'lastname' },
        { name: 'region', prop: 'region' },
        { name: 'department', prop: 'department' },
        { name: 'picture_url', prop: 'picture_url' },
        { name: 'political_group', prop: 'political_group' },
        { name: 'political_group_code', prop: 'political_group_code' }
      ],
      { table: 'deputies' } // Target table
    );

    // Generate the SQL INSERT query
    const query = db.$config.pgp.helpers.insert(deputies, columns);

    // Execute the query
    await db.none(query);

    console.log('✅ Deputies inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting deputies:', error);
    throw error;
  }
};

export { insertDeputies }
