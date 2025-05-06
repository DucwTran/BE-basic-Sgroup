import User from "../models/user.model.js";

export class UserController {

  static async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async postUser(req, res) {
    const { fullName, address, email, gender, phone, age } = req.body;

    if (!fullName || !address || !email || !gender || !phone || !age) {
      return res.status(400).json({
        message: "Vui lòng nhập đủ thông tin user",
      });
    }

    try {
      const newUser = new User({
        fullName,
        address,
        email,
        gender,
        phone,
        age,
      });

      const savedUser = await newUser.save();
      res.status(201).json({
        message: "Tạo người dùng thành công",
        user: savedUser,
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: "Email đã tồn tại" });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  static async putUser(req, res) {
    const { fullName, address, email, gender, phone, age } = req.body;

    if (!fullName || !address || !email || !gender || !phone || !age) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ thông tin",
      });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { fullName, address, email, gender, phone, age },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.status(200).json({
        message: "Cập nhật thành công",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async patchUser(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.status(200).json({
        message: "Cập nhật một phần thành công",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.status(200).json({
        message: "Xóa người dùng thành công",
        user: deletedUser,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default UserController;
