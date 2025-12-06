import pool from "../../../db";
import UserHelper from "../helpers/user.helpers";
import IUser from "../model/user.model";

export default class UserService {
  // Get User By Email
  public static getUserByEmail = async (email: string) => {
    const res = await pool.query(
      "SELECT id, name, email, phone, role FROM users WHERE email=$1",
      [email]
    );

    return res;
  };

  // Get User By Id
  public static getUserById = async (userId: number): Promise<IUser> => {
    try {
      const user = await pool.query(
        `
       SELECT id, name, email FROM users WHERE id=$1
        `,
        [userId]
      );

      return user.rows[0];
    } catch (error) {
      console.error("Database error during fetching user by id: ", error);
      throw new Error(`Database error during fetching user by id: ${error}`);
    }
  };

  // Get Users
  public static getUsers = async (): Promise<Partial<IUser>[]> => {
    try {
      const res = await pool.query(
        "SELECT id, name, email, phone, role FROM users"
      );
      return res.rows;
    } catch (error) {
      console.error("Database error during fetching users:", error);
      throw new Error(`Database error during fetching users:${error}`);
    }
  };

  // Update User
  public static updateUser = async (
    userId: string,
    payload: Partial<IUser>
  ): Promise<Omit<IUser, "created_at">> => {
    const { usersKeys, userValues, count } = UserHelper.queryHelper(payload);

    userValues.push(userId);

    console.log(usersKeys.join(", "));
    console.log({ userValues });

    try {
      const res = await pool.query(
        `UPDATE users SET ${usersKeys.join(
          ", "
        )} WHERE id=$${count} RETURNING id, name, email, phone, role `,
        userValues
      );

      return res.rows[0];
    } catch (error) {
      console.error("Database error during update user: ", error);
      throw new Error(`Error occured during update user: ${error}`);
    }
  };

  // Delete User
  public static deleteUser = async (userId: number) => {
    try {
      const res = await pool.query(
        `
          DELETE
          FROM 
              users
          WHERE
              id = $1
          `,
        [userId]
      );

      return res.rows[0];
    } catch (error) {
      console.error("Error occured during delete user: ", error);
      throw new Error(`Error occured during delete user: ${error}`);
    }
  };
}
