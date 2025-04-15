import { Alert } from "react-native";
import { 
    isValidPhoneNumber ,
    isValidPassword ,
    isValidRePassword ,
    isValidName ,
    isValidEmail ,
    isValidDate ,
    converseStringToDate ,
    isValidTrangThai ,
    isValidGioiTinh
} from "./validate"

export const isValidLogin = (sdt, matkhau ) => {
    sdt = sdt.trim();
    matkhau = matkhau.trim();
    if (!isValidPhoneNumber(sdt)) {
        Alert.alert("Số điện thoại không hợp lệ!");
        return false;
    }
    if (!isValidPassword(matkhau)) {
        Alert.alert("Mật khẩu không hợp lệ!");
        return false;
    }
    return true;
}


export const isValidSignUp = (name, ngaySinh, gioiTinh, matKhau, reMatKhau) => {
    if (!isValidName(name)) {
        alert("Tên không hợp lệ!");
        return false;
    }
    if (!isValidDate(ngaySinh)) {
        alert("Ngày sinh không hợp lệ!");
        return false;
    }
    if (!isValidGioiTinh(gioiTinh)) {
        alert("Giới tính không hợp lệ!");
        return false;
    }
    if (!isValidPassword(matKhau)) {
        alert("Mật khẩu không hợp lệ!");
        return false;
    }
    if (!isValidRePassword(matKhau, reMatKhau)) {
        alert("Mật khẩu không khớp!");
        return false;
    }
    return true;
}

export const isValidResetPass = (matKhau, reMatKhau) => {
    if( matKhau.trim().length < 8) {
        return false;
    }
    if (reMatKhau.trim().length < 8) {
        return false;
    }
  if(!isValidRePassword(matKhau, reMatKhau)) {
    throw new Error("Mật khẩu không khớp!");
  }
  return true;
}