const redis = require('./redis')
const db = require('./db')

const MAX_RETRIES = 3

async function processJobs() {
  while (true) {
    const [, value] = await redis.blpop('jobs', 0)
    const { id } = JSON.parse(value)

    // mark processing + increment attempts
    const { rows } = await db.query(
      `
      UPDATE jobs
      SET
        status = 'PROCESSING',
        attempts = attempts + 1,
        started_at = NOW()
      WHERE id = $1
      RETURNING attempts, max_attempts
      `,
      [id]
    )

    if (!rows.length) continue

    const { attempts, max_attempts } = rows[0]

    try {
      await doWork()

      await db.query(
        `
        UPDATE jobs
        SET status='SUCCESS', finished_at=NOW()
        WHERE id=$1
        `,
        [id]
      )
    } catch (e) {
      if (attempts >= max_attempts) {
        // permanently failed
        await db.query(
          `
          UPDATE jobs
          SET
            status='FAILED',
            error=$2,
            finished_at=NOW()
          WHERE id=$1
          `,
          [id, e.message]
        )
      } else {
        // retry: push back to Redis
        await redis.rpush('jobs', JSON.stringify({ id }))

        await db.query(
          `
          UPDATE jobs
          SET status='PENDING', error=$2
          WHERE id=$1
          `,
          [id, e.message]
        )
      }
    }
  }
}

const doWork = async () => {
  await new Promise(r => setTimeout(r, 2000))
}

processJobs()
