export default interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "customer" | "admin";
  created_at?: Date;
}
