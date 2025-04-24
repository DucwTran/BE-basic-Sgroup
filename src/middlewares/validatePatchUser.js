export function validatePatchUser(req, res, next) {
  const user = req.body;
  const errors = [];

  if (
    "fullName" in user &&
    (typeof user.fullName !== "string" || user.fullName.trim().length < 10)
  ) {
    return res
      .status(400)
      .json({ message: "Họ tên phải có ít nhất 10 ký tự." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if ("email" in user && !emailRegex.test(user.email)) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }

  if ("gender" in user && user.gender !== "male" && user.gender !== "female") {
    return res
      .status(400)
      .json({ message: "Giới tính chỉ được phép là 'male' hoặc 'female'." });
  }

  if (
    "age" in user &&
    (typeof user.age !== "number" || user.age <= 0 || user.age >= 20)
  ) {
    return res
      .status(400)
      .json({ message: "Tuổi phải là số và nằm trong khoảng 1 đến 19." });
  }

  const phoneRegex = /^09\d{9}$/;
  if ("phone" in user && !phoneRegex.test(user.phone)) {
    return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
  }

  next();
}
