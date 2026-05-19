

const PORT = 5000;
const email = "admin@hospital.com";
const password = "admin123";

async function run() {
  // Login
  const loginRes = await fetch(`http://127.0.0.1:${PORT}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  
  if (!token) {
    console.log("Login failed");
    return;
  }

  // Get doctors
  const docRes = await fetch(`http://127.0.0.1:${PORT}/api/doctors`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const doctors = await docRes.json();
  
  console.log(`Found ${doctors.length} doctors`);
  
  if (doctors.length > 0) {
    const docToDelete = doctors[doctors.length - 1]; // Delete the last one
    console.log(`Trying to delete doctor ID: ${docToDelete._id}`);
    
    const delRes = await fetch(`http://127.0.0.1:${PORT}/api/doctors/${docToDelete._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (delRes.ok) {
      console.log("Delete successful:", await delRes.json());
    } else {
      console.log("Delete failed:", delRes.status, await delRes.text());
    }
  }
}

run().catch(console.error);
