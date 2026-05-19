

async function run() {
  const loginRes = await fetch("http://127.0.0.1:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@hospital.com", password: "admin123" })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  const res = await fetch("http://127.0.0.1:5000/api/reports", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  console.log(data);
}
run();
