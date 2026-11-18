const keyRouter = require('express').Router()
const verifyToken = require('../middleware/authMiddleware')
const { pool } = require('../db/pool')

keyRouter.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        k.id,
        k.code,
        k.name,
        k.location,

        CASE
          WHEN c.id IS NULL THEN 'available'
          ELSE 'borrowed'
        END AS status,

        COALESCE(c.user_id = $1, FALSE) AS "isBorrowedByMe",

        CASE
          WHEN c.user_id = $1 THEN c.id
          ELSE NULL
        END AS "checkoutId"

      FROM keys AS k

      LEFT JOIN checkouts AS c
        ON c.key_id = k.id
        AND c.returned_at IS NULL

      ORDER BY k.id
    `, [req.user.id])

    return res.status(200).json(result.rows)
  } catch (error) {
    console.error('Failed to fetch keys:', error)
    return res.status(500).json({ error: 'Failed to fetch keys' })
  }
})

module.exports = keyRouter