import { userInfo } from 'node:os';
import db from '../db/index.js';
import { usersTable } from '../models/user.model.js';
import { eq } from 'drizzle-orm';
export const getUserByEmail = async (email) => {
  try {
    const [existingUser] = await db
      .select({
        id: usersTable.id,
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
        email: usersTable.email,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    console.log(existingUser);
    console.log(email);
    return existingUser;
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (
  firstname,
  lastname,
  email,
  salt,
  password,
) => {
  try {
    const [newUser] = await db
      .insert(usersTable)
      .values({ firstname, lastname, email, salt, password })
      .returning({
        id: usersTable.id,
      });
    return newUser;
  } catch (error) {
    console.log(error);
  }
};
