const BASE_URL = "http://localhost:4000";

export const loginwithgoogle = async (idToken) => {
  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json();
  console.log(data);
};
