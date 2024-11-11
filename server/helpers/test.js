import fs from 'fs'
import path from 'path'
import { pool } from './db.js'
import bcrypt from 'bcrypt'
import pkg from 'jsonwebtoken'

const { sign } = pkg
const __dirname = import.meta.dirname

const initializeTestDb = async () => {
    const sql = fs.readFileSync(path.resolve(__dirname,"../todo.sql"), "utf8");
    await pool.query(sql)
}

const insertTestUser = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('insert into account (email,password) values ($1,$2)', [email,hashedPassword])
}

const getToken = (email) => {
    return sign({user: email},process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken }