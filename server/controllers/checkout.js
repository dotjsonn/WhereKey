const checkoutRouter = require('express').Router()
const { pool } = require('../db/pool')
const verifyToken = require('../middleware/authMiddleware')

checkoutRouter.post('/', verifyToken, async (req, res) => {
  const { keyId } = req.body || {}

  if (!Number.isInteger(keyId) || keyId <= 0 || keyId > 2147483647) {
    return res.status(400).json({ error: 'Invalid key ID' })
  }

  try {
    const keyResult = await pool.query(`
      SELECT id FROM keys WHERE id = $1
    `, [keyId])

    if (keyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Key not found' })
    }

    const result = await pool.query(`
      INSERT INTO checkouts (user_id, key_id)
      VALUES ($1, $2)
      RETURNING id, 
        user_id AS "userId", 
        key_id AS "keyId", 
        borrowed_at AS "borrowedAt", 
        returned_at AS "returnedAt"
    `, [req.user.id, keyId])

    return res.status(201).json(result.rows[0])
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'one_active_checkout_per_key') {
      return res.status(409).json({
        error: 'Key is already borrowed'
      })
    }

    console.error('Checkout failed:', error)
    return res.status(500).json({ error: 'Failed to check out key' })
  }
})

checkoutRouter.patch('/:id/return', verifyToken, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    return res.status(400).json({ error: 'Invalid checkout ID' })
  }

  try {
    const checkoutResult = await pool.query(`
      SELECT * FROM checkouts
      WHERE id = $1
    `, [id])

    const checkout = checkoutResult.rows[0]

    if (!checkout) {
      return res.status(404).json({ error: 'Checkout not found' })
    }

    if (checkout.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You cannot return this checkout' })
    }

    if (checkout.returned_at !== null) {
      return res.status(409).json({ error: 'Checkout already returned' })
    }

    const result = await pool.query(`
      UPDATE checkouts
      SET returned_at = NOW()
      WHERE id = $1 AND user_id = $2 AND returned_at IS NULL
      RETURNING
        id,
        user_id AS "userId",
        key_id AS "keyId",
        borrowed_at AS "borrowedAt",
        returned_at AS "returnedAt"
      `, [checkout.id, req.user.id])

    if (result.rows.length === 0) {
      return res.status(409).json({ error: 'Checkout is no longer active' })
    }
    const updatedCheckout = result.rows[0]
    res.status(200).json(updatedCheckout)
  } catch (error) {
    console.error('Return failed:', error)
    return res.status(500).json({ error: 'Failed to return key' })
  }
})

checkoutRouter.get('/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.key_id AS "keyId",
        k.code,
        k.name,
        k.location,
        c.borrowed_at AS "borrowedAt",
        c.returned_at AS "returnedAt",
        CASE
          WHEN c.returned_at IS NULL THEN 'active'
          ELSE 'returned'
        END AS status

      FROM checkouts AS c
      JOIN keys AS k
        ON k.id = c.key_id

      WHERE c.user_id = $1
      ORDER BY c.borrowed_at DESC, c.id DESC
    `, [req.user.id])

    return res.status(200).json(result.rows)
  } catch (error) {
    console.error('Failed to fetch borrowing history:', error)
    return res.status(500).json({
      error: 'Failed to fetch borrowing history'
    })
  }
})

module.exports = checkoutRouter