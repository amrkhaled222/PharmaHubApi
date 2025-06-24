import axios from "axios";
const serverUrl =
  process.env.NEXT_PUBLIC_Server_URL || "http://localhost:8080/api/"; // Replace with your server URL

const api = axios.create({
  baseURL: serverUrl, // Replace with your API base URL
  withCredentials: true, // This allows sending credentials (cookies, authorization headers, etc.)
  headers: {
    "Content-Type": "application/json", // Set content type if necessary
    platform: "Web", // You can set any header you want here
  },
});

// export const signIn = async (email, password) => {
//   try {
//     const user = await api.post("auth/signin", {
//       emailOrUsername: email,
//       password: password,
//     });

//     const userdata = user.data.user;
//     localStorage.setItem("userData", JSON.stringify(userdata));
//     localStorage.setItem("AccessToken", JSON.stringify(user.data.accessToken));
//     return userdata;
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// Request interceptor to include token as a cookie
// api.interceptors.request.use(
//   (config) => {
//     // Get the token from localStorage

//     const token = localStorage.getItem("AccessToken");
//     // console.log(token);
//     if (token !== "undefined" || !token) {
//       config.headers.Authorization = `Bearer ${JSON.parse(
//         localStorage.getItem("AccessToken")
//       )} `;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// )

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // if (
    //   (error.response && error.response.status === 401) ||
    //   (error.response && error.response.status === 403)
    // ) {
    // localStorage.clear();
    // if (window.location.pathname !== "/auth") {
    //   window.location.replace("/auth"); // Redirect to auth page
    // }
    return Promise.reject(error);
    // }
    // return Promise.reject(error);
  }
);

export default api;
