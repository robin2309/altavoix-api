import db from '#config/db.js';

const insertVotes = async (votes) => {
  try {
    // Define column mappings
    const columns = new db.$config.pgp.helpers.ColumnSet(
      [
        { name: 'deputy_id', prop: 'deputyId' },
        { name: 'poll_id', prop: 'pollId' },
        { name: 'standing', prop: 'standing' }
      ],
      { table: 'votes' }
    );

    // Generate the SQL INSERT query
    const query = db.$config.pgp.helpers.insert(votes, columns);

    // Execute the query
    await db.none(query);
  } catch (error) {
    console.error('❌ Error inserting deputies:', error)
    throw error
  }
}

export { insertVotes }