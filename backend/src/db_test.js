const PORT = 5000;
const email = "admin@hospital.com";
const password = "admin123";

async function run() {
  console.log("Simulating Admin login...");
  const loginRes = await fetch(`http://127.0.0.1:${PORT}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log("Token acquired:", token ? (token.slice(0, 20) + "...") : "FAILED");

  if (!token) {
    console.log("Login payload:", loginData);
    return;
  }

  const nurseEmail = `test_nurse_${Date.now()}@hospital.com`;

  console.log("\n1. Simulating Nurse Creation (POST)...");
  const createRes = await fetch(`http://127.0.0.1:${PORT}/api/auth/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: "Test Nurse Hodan",
      email: nurseEmail,
      password: "nursepassword123",
      role: "Nurse",
      gender: "Female",
      phone: "+252 61 123 4567"
    })
  });
  const createdNurse = await createRes.json();
  console.log("Create status:", createRes.status);
  console.log("Created Nurse data:", createdNurse);

  if (createRes.status !== 210 && createRes.status !== 201) {
    console.log("Failed to create nurse!");
    return;
  }

  const nurseId = createdNurse._id;

  console.log("\n2. Simulating Nurse Update/Edit (PUT)...");
  const updateRes = await fetch(`http://127.0.0.1:${PORT}/api/auth/users/${nurseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: "Test Nurse Hodan (Updated)",
      gender: "Male",
      phone: "+252 61 987 6543",
      status: "On Duty"
    })
  });
  const updatedNurse = await updateRes.json();
  console.log("Update status:", updateRes.status);
  console.log("Updated Nurse data:", updatedNurse);

  console.log("\n3. Simulating Nurse Deletion (DELETE)...");
  const deleteRes = await fetch(`http://127.0.0.1:${PORT}/api/auth/users/${nurseId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  const deleteData = await deleteRes.json();
  console.log("Delete status:", deleteRes.status);
  console.log("Delete returned message:", deleteData);
}

run().catch(console.error);
