export function validateCreateUser(req, res, next) {
  const user = req.body;

  if (typeof user.fullName !== "string" || user.fullName.trim().length < 10) {
    return res
      .status(400)
      .json({ message: "Họ tên phải có ít nhất 10 ký tự." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || !emailRegex.test(user.email)) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }

  if (user.gender !== "male" && user.gender !== "female") {
    return res
      .status(400)
      .json({ message: "Giới tính chỉ được phép là 'male' hoặc 'female'." });
  }

  if (typeof user.age !== "number" || user.age <= 0 || user.age >= 20) {
    return res
      .status(400)
      .json({ message: "Tuổi phải là số và nằm trong khoảng 1 đến 19." });
  }

  next();
}
