import db from '#config/db.js';

const createPoll = async ({id, title, votedAt}) => {
  try {
    const data = await db.one('INSERT INTO polls(id, title, voted_at) VALUES($1, $2, DATE $3) RETURNING id', [id, title, votedAt])
    return data.id
  } catch (error) {
    console.log('Error creating poll:', error)
    throw error
  }
}

export { createPoll }