// Hàm mã hóa đơn giản: dịch mỗi ký tự theo bảng mã ASCII
export function simpleHash(password) {
  const shift = 5;
  let result = "";
  for (let i = 0; i < password.length; i++) {
    result += String.fromCharCode(password.charCodeAt(i) + shift);
  }
  return result;
}

export function simpleCompare(rawPassword, hashedPassword) {
  return simpleHash(rawPassword) === hashedPassword;
}
