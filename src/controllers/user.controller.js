import { UserService } from "../services/user.service.js";
import { BadRequestError, NotFoundError } from "../handlers/error.response.js";

export class UserController {
  static async getAllUsers(req, res) {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  }

  static async getUserById(req, res) {
    const user = await UserService.getUserById(req.params.id);
    if (!user) throw new NotFoundError("User not found");
    res.status(200).json(user);
  }

  static async postUser(req, res) {
    const { fullName, address, email, gender, phone, age } = req.body;

    if (!fullName || !address || !email || !gender || !phone || !age) {
      throw new BadRequestError("Vui lòng nhập đủ thông tin user");
    }

    const user = await UserService.createUser({
      fullName,
      address,
      email,
      gender,
      phone,
      age,
    });

    res.status(201).json({ message: "Tạo người dùng thành công", user });
  }

  static async putUser(req, res) {
    const { fullName, address, email, gender, phone, age } = req.body;

    if (!fullName || !address || !email || !gender || !phone || !age) {
      throw new BadRequestError("Vui lòng cung cấp đầy đủ thông tin");
    }

    const user = await UserService.updateUser(req.params.id, {
      fullName,
      address,
      email,
      gender,
      phone,
      age,
    });

    if (!user) throw new NotFoundError("Không tìm thấy người dùng");

    res.status(200).json({ message: "Cập nhật thành công", user });
  }

  static async patchUser(req, res) {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (!user) throw new NotFoundError("Không tìm thấy người dùng");

    res.status(200).json({ message: "Cập nhật một phần thành công", user });
  }

  static async deleteUser(req, res) {
    const user = await UserService.deleteUser(req.params.id);
    if (!user) throw new NotFoundError("Không tìm thấy người dùng");

    res.status(200).json({ message: "Xóa người dùng thành công", user });
  }

  static async getUserInfo(req, res) {
    const user = await UserService.getUserInfo(req.userId);
    if (!user) throw new NotFoundError("Người dùng không tồn tại");

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      address: user.address,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
    });
  }
}

export default UserController;
