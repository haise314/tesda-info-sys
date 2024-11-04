// import axios from "axios";

// export const verifyRecaptcha = async (token) => {
//   try {
//     const response = await axios.post(
//       "https://www.google.com/recaptcha/api/siteverify",
//       null,
//       {
//         params: {
//           secret: process.env.RECAPTCHA_SECRET_KEY,
//           response: token,
//         },
//       }
//     );

//     console.log("reCAPTCHA verification response:", response.data);

//     if (!response.data.success) {
//       console.error(
//         "reCAPTCHA verification failed:",
//         response.data["error-codes"]
//       );
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error("reCAPTCHA verification error:", error);
//     return false;
//   }
// };

import axios from "axios";

export const verifyRecaptcha = async (token) => {
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    return response.data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
};
