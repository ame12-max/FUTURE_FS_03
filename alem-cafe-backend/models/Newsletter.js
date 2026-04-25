const db = require('../config/db');

const Newsletter = {
  subscribe: async (email) => {
    try {
      const [result] = await db.query(
        'INSERT INTO newsletter (email) VALUES (?)',
        [email]
      );
      return result.insertId;
    } catch (err) {
      // If duplicate email, return null (already subscribed)
      if (err.code === 'ER_DUP_ENTRY') {
        return null;
      }
      throw err;
    }
  }
};

module.exports = Newsletter;