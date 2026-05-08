/**
 * Applies supabase/seed.sql (DDL), then inserts random demo rows via pg loops.
 * Usage: npm run db:seed (requires DATABASE_URL in .env)
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const sqlPath = join(root, 'supabase', 'seed.sql')

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('Missing DATABASE_URL in environment (.env).')
  process.exit(1)
}

const FIRST_NAMES = [
  'Maksim',
  'Denis',
  'Andrey',
  'Artem',
  'Andrey',
  'Tatsiana',
  'Yauheni',
  'Dzmitry',
  'Uladzimir',
  'Kanstantsin',
  'Pavel',
  'Sviatlana',
  'Maryia',
  'Sergei',
  'Anastasiya',
  'Iryna',
  'Sviatlana',
  'Yuliya',
  'Yaroslav',
  'Vladimir',
]

/** Transliterated Russian-style surnames */
const LAST_NAMES = [
  'Ivanov',
  'Smirnov',
  'Kuznetsov',
  'Popov',
  'Sokolov',
  'Lebedev',
  'Kozlov',
  'Novikov',
  'Morozov',
  'Volkov',
  'Alekseev',
  'Solovyev',
  'Vasiliev',
  'Zaytsev',
  'Pavlov',
  'Semenov',
  'Golubev',
  'Vinogradov',
  'Bogdanov',
  'Vorobyov',
  'Fedorov',
  'Mikhailov',
  'Belov',
  'Tarasov',
  'Komarov',
  'Orlov',
  'Andreev',
  'Makarov',
  'Nikolayev',
  'Zakharov',
  'Stepanov',
  'Yakovlev',
  'Sorokin',
  'Sergeev',
  'Romanov',
  'Kuzmin',
  'Aleksandrov',
  'Dmitriev',
  'Kolesnikov',
  'Grigoriev',
  'Antonov',
  'Bogachev',
  'Frolov',
  'Voronin',
  'Malakhov',
  'Nikitin',
  'Savelyev',
  'Nikiforov',
  'Davydov',
  'Egorov',
]

const POSITIONS = [
  'Software Engineer',
  'Software Engineer',
  'Software Engineer',
  'Software Engineer',
  'Software Engineer',
  'Software Engineer',
  'Designer',
  'Marketing Manager',
  'Product Manager',
  'Team Manager',
  'Customer Support Manager',
  'HR Manager',
  'Legal Manager',
  'Senior Designer',
  'Senior Software Engineer',
  'Senior Software Engineer',
  'Senior Software Engineer',
  'Senior Product Manager',
  'Senior Sales Manager',
  'Senior Customer Support Manager',
  'Senior HR Manager',
  'Lead Software Engineer',
  'Lead Software Engineer',
]

/** Fixed category names required by the seed spec */
const ACTIVITY_CATEGORY_NAMES = [
  'Education',
  'Public Speaking',
  'University Partnership',
]

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[randomInt(0, arr.length - 1)]
}

function randomPersonName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`
}

function randomPosition() {
  return `${pick(POSITIONS)} (${randomDepartment()})`
}

function randomDepartment() {
  return `${pick(["BY", "KG", "PL", "MU", "UZ"])}.${pick(["U1", "U2", "U3"])}.${pick(["D1", "D2", "D3", "Spacecraft"])}.${pick(["T1", "T2", "T3"])}`
}

/** Random time within the last ~400 days */
function randomTimestamptz() {
  const now = Date.now()
  const offsetMs = Math.floor(Math.random() * 400 * 24 * 60 * 60 * 1000)
  return new Date(now - offsetMs).toISOString()
}

const ACTIVITY_TITLE_TEMPLATES = [
  '[REG] Peer review workshop',
  '[EXT] Conference dry run',
  '[INT] Internal guild presentation',
  '[INT] QA handbook update',
  '[REG] Testing bootcamp session',
  '[EXT] Customer training webinar',
  '[INT] Release retrospective notes',
  '[REG] Accessibility audit walkthrough',
  '[EXT] Innovation day booth',
  '[REG] Cross-team knowledge share',
  '[REG] Technical interview',
  '[EDU] PHP News Digest',
  '[EDU] Advanced SQL workshop',
  '[EDU] Git best practices',
  '[EDU] Docker deep dive',
  '[EDU] Kubernetes fundamentals',
  '[EDU] React performance optimization',
  '[EDU] Node.js architecture',
  '[EDU] Python machine learning',
  '[EDU] Go programming',
  '[EDU] AI tools for developers',
  '[EDU] Cybersecurity essentials',
  '[EDU] Cloud computing fundamentals',
  '[EDU] DevOps automation',
  '[EDU] Data visualization',
  '[EDU] Project management',
  '[EDU] Leadership skills',
  '[EDU] Communication techniques',
  '[EDU] Time management',
]

function randomActivityTitle() {
  if (Math.random() < 0.2) {
    return '[LAB] Mentoring of {name}'.replace('{name}', randomPersonName())
  }
  return pick(ACTIVITY_TITLE_TEMPLATES)
}

const sql = readFileSync(sqlPath, 'utf8')
const client = new pg.Client({ connectionString })

try {
  await client.connect()

  await client.query('BEGIN')
  await client.query(sql)

  const categoryIds = []
  const categoryIdByName = {}
  for (const name of ACTIVITY_CATEGORY_NAMES) {
    const { rows } = await client.query(
      'INSERT INTO public.activity_categories (name) VALUES ($1) RETURNING id',
      [name],
    )
    const id = Number(rows[0].id)
    categoryIds.push(id)
    categoryIdByName[name] = id
  }

  const userIds = []
  for (let i = 0; i < 100; i++) {
    const { rows } = await client.query(
      'INSERT INTO public.users (name, position) VALUES ($1, $2) RETURNING id',
      [randomPersonName(), randomPosition()],
    )
    userIds.push(Number(rows[0].id))
  }

  let activityCount = 0
  for (const userId of userIds) {
    const activitiesForUser = randomInt(1, 20)
    for (let a = 0; a < activitiesForUser; a++) {
      const date = randomTimestamptz()
      const points = randomInt(1, 100)
      const title = randomActivityTitle()
      let categoryId = pick(categoryIds)
      if (title.startsWith('[LAB] Mentoring of')) {
        categoryId = categoryIdByName['Education']
      }
      await client.query(
        'INSERT INTO public.activities (user_id, category_id, title, date, points) VALUES ($1, $2, $3, $4::timestamptz, $5)',
        [userId, categoryId, title, date, points],
      )
      activityCount++
    }
  }

  await client.query('COMMIT')

  console.log('Schema applied:', sqlPath)
  console.log(
    `Inserted: ${categoryIds.length} categories, ${userIds.length} users, ${activityCount} activities`,
  )
} catch (err) {
  await client.query('ROLLBACK').catch(() => {})
  console.error(err)
  process.exit(1)
} finally {
  await client.end()
}
