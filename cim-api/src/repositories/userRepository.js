import BaseRepository from "./baseRepository.js";

class UserRepository extends BaseRepository {
  async createUser(data) {
    const { firstName, email, phoneNumber, passwordHash } = data;

    return await this.executeNonQuery("fn_createUser", [
      firstName,
      email,
      phoneNumber,
      passwordHash,
    ]);
  }

  async getUserByEmail(email) {
    return await this.executeFunction("fn_getUserByEmail", [email]);
  }
}

export default new UserRepository();
