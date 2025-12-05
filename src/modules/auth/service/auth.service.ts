import bcrypt from "bcrypt";
import pool from "../../../db";

interface ISignUpUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "customer" | "admin";
}

export default class AuthService {
  // Hanshing Pasword
  private static hashPassword = async (pass: string): Promise<any> => {
    try {
      const hashedPass = await bcrypt.hash(pass, 10);
      return hashedPass;
    } catch (error) {
      console.error("bcrypt error: ", error);
    }
  };

  // Compare Password
  private static comparedPassword = async (
    pass: string,
    storedPass: string
  ): Promise<any> => {
    try {
      return await bcrypt.compare(pass, storedPass);
    } catch (error) {
      console.error("bcrypt compare password error: ", error);
    }
  };

  // SignUp User
  public static signUpUser = async (payload: ISignUpUser) => {
    const { name, email, password, phone, role } = payload;

    const hashedPass = await this.hashPassword(password);

    const res = await pool.query(
      "INSERT INTO users (name, email, phone, password, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role",
      [name, email, phone, hashedPass, role]
    );

    return res;
  };

  // Signin User
  public static signInUser = async (
    payload: Pick<ISignUpUser, "email" | "password">
  ) => {
    const { email, password } = payload;

    const user = await pool.query("SELECT password FROM users WHERE email=$1", [
      email,
    ]);

    const storedPass = user.rows[0].password;

    const isMatched = await this.comparedPassword(password, storedPass);

    return isMatched;
  };
}
