// sdt, matKhau
export const login = async (username, password) => {
    if (!username || !password) {
        throw new Error("Username and password are required");
    }
    console.log("Login function called with:", username, password);
  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sdt: username,
        matKhau: password,
      }),
    });
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers.get("Content-Type"));
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
// sdt, name, ngaySinh, matKhau,email
export const register = async (phoneNumber, name, birth,  password,email) => {
  try {
    const response = await fetch("http://localhost:5000/api/registerUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        sdt: phoneNumber,
        name: name,
        ngaySinh: birth,
        matKhau: password,
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
};

export const changePass = async (phoneNumber,newPassword) => {
    try {
        const response = await fetch("http://localhost:5000/api/users/doimatkhau", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            sdt: phoneNumber,
            matKhau: newPassword,
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


