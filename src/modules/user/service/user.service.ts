import pool from "../../../db";

export default class UserService {
  public static getUserByEmail = async (email: string) => {
    const res = await pool.query(
      "SELECT id, name, email, phone, role FROM users WHERE email=$1",
      [email]
    );

    return res;
  };
}
