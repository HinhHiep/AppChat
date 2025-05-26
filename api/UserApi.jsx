// sdt, matKhau
import axios from "axios";
export const login = async (username, password) => {
    if (!username || !password) {
        throw new Error("Username and password are required");
    }
    console.log("Login function called with:", username, password);
  try {
    const response = await fetch("https://cnm-service.onrender.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sdt: username,
        matKhau: password,
      }),
    });
    // console.log("Response status:", response.status);
    // console.log("Response headers:", response.headers.get("Content-Type"));
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    // Save the token to local storage or state management
    console.log("Login successful:", data);
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
// doi trang thai
export const updateStatus = async (userID, status) => {
  try {
    const response = await fetch("https://cnm-service.onrender.com/api/updateStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID,
        trangThai:status,
      }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during updateStatus:", error);
    throw error;
  }
};
// sdt, name, ngaySinh, matKhau,email
export const register = async (phoneNumber, name, birth,password,email,gender) => {
  try {
    const response = await fetch("https://cnm-service.onrender.com/api/registerUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        sdt: phoneNumber,
        name: name,
        ngaySinh: birth,
        matKhau: password,
        email: email,
        gioTinh:gender
      }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during register:", error);
    throw error;
  }
};

export const changePass = async (sdt,matKhau) => {
    try {
      const response = await axios.post(
        "https://cnm-service.onrender.com/api/users/doimatkhau",
        {sdt, matKhau }, // Thêm email và sdt vào payload
        { headers: { "Content-Type": "application/json" } }
      ).catch((err) => {
        throw new Error(`Lỗi khi cập nhật mật khẩu: ${err.message}`);
      });
        
        return response.data; // Trả về dữ liệu từ phản hồi
    } catch (error) {
        console.error("Error during register:", error);
        throw error;
    }
    }
export const getOTP = async (email) =>{
  try {
    const response = await fetch("https://cnm-service.onrender.com/api/send-otp", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
        email: email
    }),
    });
    
    if (!response.ok) {
    throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
} catch (error) {
    console.error("Error during register:", error);
    throw error;
}
}
export const checkGmail = async (email) =>{
  const responseEmail = await axios.post('https://cnm-service.onrender.com/api/users/email', 
    { email },
    { headers: { 'Content-Type': 'application/json' } }
  ).catch(err => {
    throw new Error(`Lỗi kiểm tra email: ${err.message}`);
  });
  return responseEmail; // Trả về dữ liệu từ phản hồi
}
export const updateUserProfile = async (userData) => {
  try {
    const response = await fetch(`https://cnm-service.onrender.com/api/users/${userData.userID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || 'Có lỗi xảy ra trong quá trình cập nhật';
      Alert.alert('Lỗi', message);
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu:', error);
    Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    return null;
  }
};

export const checkSDT = async (sdt) =>{
  const responseEmail = await axios.post('https://cnm-service.onrender.com/api/users/checksdt', 
    { sdt },
    { headers: { 'Content-Type': 'application/json' } }
  ).catch(err => {
    throw new Error(`Lỗi kiểm tra email: ${err.message}`);
  });
  return responseEmail; // Trả về dữ liệu từ phản hồi
}
export const checkAccount = async (email, sdt) => {
  try {
     const responseEmail = await axios.post('https://cnm-service.onrender.com/api/users/checksdt', 
    { email,sdt },
    { headers: { 'Content-Type': 'application/json' } }
  ).catch(err => {
    throw new Error(`Lỗi kiểm tra email: ${err.message}`);
  });
  return responseEmail; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    console.error("Error during checkAccount:", error);
    throw error;
    
  }
};

export const getChatsForUser = async (userID) => {
  try {
    const response = await fetch('https://cnm-service.onrender.com/api/chats/userID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Network response was not ok");
    }
    
    return data;
  } catch (err) {
    throw new Error(`Lỗi lấy thành viên chat: ${err.message}`);
  }
};

export const createChatID = async (newMsg) => {
  try {
    const response = await fetch('https://cnm-service.onrender.com/api/creatmsg/chatID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newMsg}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Network response was not ok");
    }
    
    return data;
  } catch (err) {
    throw new Error(`Lỗi lấy thành viên chat: ${err.message}`);
  }

}






