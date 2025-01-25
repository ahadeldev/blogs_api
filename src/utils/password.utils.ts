import bcrypt from "bcryptjs";

/* 
  * Generate a hashed version of the user password for saving in database.
  * @param { string } password - The user plain text password.
  * @returns { Promise<string> } - Returns the hashed version of the password as a string.
*/
const hashPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt(12);
  const hashedPassword: string = await bcrypt.hash(password, salt);
  return hashedPassword;
}

/* 
  * Comparing both the user password submitted while logging in and the user password stored in the database.
  * @param { string } password - The user plain text password.
  * @param { string } dbPassword - The user hashed password from the database.
  * @returns { boolean } - Returns true if the passwords match, false otherwise.
*/

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const correctPassword = await bcrypt.compare(password, hashedPassword);
  return correctPassword;
}

export { hashPassword, comparePassword };