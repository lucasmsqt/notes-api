import { User } from "../interfaces";
import pool from "../config/db";

export function findUserByEmail(email: string): Promise<User | null> {
    return pool
    .query('SELECT * FROM auth.users WHERE email = $1', [email])
    .then((result) => result.rows[0] || null);
}