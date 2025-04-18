export const isValidName = (name) => {
    name = name.trim();
  const regex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐ\s]+$/;
  return regex.test(name);
}


export const isValidEmail = (email) => {
    email = email.trim();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

export const isValidPhoneNumber = (phoneNumber) => {
    phoneNumber = phoneNumber.trim();
    const regex = /^(0[3,5,7,8,9])[0-9]{8}$/
    return regex.test(phoneNumber);
}

export const isValidPassword = (password) => {
    password = password.trim();
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return regex.test(password);
}

export const isValidRePassword = (password, rePassword) => {
    return password === rePassword;
}
export const isValidDate = (dateString) => {
    dateString = dateString.trim();
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    if (!regex.test(dateString)) {
        return false;
    }
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}

export const converseStringToDate = (dateString) => {
    dateString = dateString.trim();
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}

export const isValidTrangThai = (trangThai) => {
    trangThai = trangThai.trim();
    // Trạng thái có thể là "online" hoặc "offline"
    const regex = /^(online|offline)$/;
    return regex.test(trangThai);
}

export const isValidGioiTinh = (gioiTinh) => {
    gioiTinh = gioiTinh.trim();
    // Giới tính có thể là "Nam", "Nữ" hoặc "Khác"
    const regex = /^(Nam|Nữ|Khác)$/;
    return regex.test(gioiTinh);
}
