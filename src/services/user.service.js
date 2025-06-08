import {
  ConflictRequestError,
  NotFoundError,
} from "../handlers/error.response.js";
export class UserService {
  constructor(User, Vote, AuthUtil) {
    //Mỗi thuộc tính bạn gán cho this trong constructor sẽ trở thành thuộc tính instance (property của đối tượng).
    this.userModel = User;
    this.AuthUtil = AuthUtil;
    this.voteModel = Vote;
  }
  // Vì arrow function không có this riêng – nó kế thừa this từ phạm vi bên ngoài.
  // Khi gán method làm callback (như middleware), this sẽ bị mất nếu bạn dùng function thường:
  getAllUsers = async () => {
    return await this.userModel.find();
  };

  getUserById = async (userId) => {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    return user;
  };

  createUser = async (userInit) => {
    const { fullName, address, email, gender, phone, age, password } = userInit;

    if (
      !fullName ||
      !address ||
      !email ||
      !gender ||
      !phone ||
      !age ||
      !password
    ) {
      throw new BadRequestError("Input more infomation of user");
    }

    const emailExisting = await this.userModel.find({ email: email });
    if (emailExisting) {
      throw new ConflictRequestError("Email was existed");
    }
    const hashPassword = this.AuthUtil.hashPassword(password);
    const newUser = new this.userModel({
      email: email,
      fullName: fullName,
      address: address,
      password: hashPassword,
      gender: gender,
      phone: phone,
      age: parseInt(age),
      role: "user",
    });
    await newUser.save();
    return newUser;
  };

  updateUser = async (id, userData) => {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundError("User Not Found");
    } else {
      const emailExisting = await this.userModel.findOne({
        email: userData.email,
      });
      if (emailExisting) {
        throw new ConflictRequestError("This email already exists!");
      }
      if (userData.password) {
        const hashPassword = AuthUtil.hashPassword(userData.password);
        user.password = hashPassword;
      }
      user.name = userData.name;
      user.age = userData.age;
      user.email = userData.email;
      user.username = userData.username;

      await user.save();
      return user;
    }
  };

  deleteUser = async (userId) => {
    const user = await this.userModel.findById(userId);
    console.log(user);
    console.log(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    await this.userModel.deleteOne({ _id: userId });
    // await this.voteModel.deleteMany({ userId: userId });
    return user;
  };

  getUserInfo = async (id) => {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    return user;
  };
}

export default UserService;
