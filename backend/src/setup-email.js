import readline from "readline";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n=======================================================");
console.log("🏥 ROYAL HOSPITAL - EMAIL SENDER SETUP WIZARD 🏥");
console.log("=======================================================\n");
console.log("Website-kaagu uma baahna inuu online yahay si uu email dhab ah u diro.");
console.log("Node.js wuxuu si toos ah uga diri karaa kombiyuutarkaaga hadda.");
console.log("Fadlan raac tillaabooyinkan si aad u bilowdo dirista Gmail-lada dhabta ah:\n");

rl.question("👉 Qor Gmail-ka Diraha ah (Sender Email): ", (email) => {
  const cleanEmail = email.trim();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    console.log("❌ Email sax ah ma ahan!");
    rl.close();
    process.exit(1);
  }

  rl.question("👉 Qor App Password-kaaga Google (16 xaraf, e.g. abcd efgh ijkl mnop): ", async (password) => {
    const cleanPassword = password.trim().replace(/\s/g, ""); // remove spaces
    if (!cleanPassword || cleanPassword.length < 16) {
      console.log("❌ App Password-ku waa inuu ahaadaa 16 xaraf!");
      rl.close();
      process.exit(1);
    }

    console.log("\n🔄 Waxaa la tijaabinayaa xiriirka Gmail SMTP...");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: cleanEmail,
        pass: cleanPassword,
      },
    });

    try {
      // Verify connection
      await transporter.verify();
      console.log("✅ Xiriirka Gmail SMTP waa guul! Server-ku wuu ku xirmay.");

      console.log(`\n🔄 Waxaa email xaqiijin tijaabo ah loo dirayaa ${cleanEmail}...`);
      await transporter.sendMail({
        from: `"Royal Hospital Mailer" <${cleanEmail}>`,
        to: cleanEmail,
        subject: "🎉 Gmail SMTP Setup Successful - Royal Hospital",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
            <h2 style="color: #1b75bb; text-align: center;">Royal Hospital Portal</h2>
            <p>Hambalyo! Nidaamka dirista email-lada ee isbitaalkaaga waa u shaqaynayaa si guul leh.</p>
            <p>Lixdan koodh ee hoose waa tusaale xaqiijin ah:</p>
            <div style="background-color: #f7f9fc; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #1b75bb; letter-spacing: 5px; border-radius: 8px; margin: 20px 0;">
              888888
            </div>
            <p style="color: #666; font-size: 12px;">Email-kan waxaa loo soo diray in lagu xaqiijiyo in dirista Gmail-lada dhabta ah ay shaqaynayso.</p>
          </div>
        `,
      });
      console.log(`✉️ Email-kii tijaabada ahaa waa la diray! Fadlan hubi sanduuqaaga (Inbox-ka) ${cleanEmail}.`);

      // Write to .env
      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
      }

      // Check and update SMTP settings in .env
      const lines = envContent.split("\n");
      const updatedLines = [];
      let serviceUpdated = false;
      let userUpdated = false;
      let passUpdated = false;

      for (let line of lines) {
        if (line.startsWith("SMTP_SERVICE=")) {
          updatedLines.push(`SMTP_SERVICE=gmail`);
          serviceUpdated = true;
        } else if (line.startsWith("SMTP_USER=")) {
          updatedLines.push(`SMTP_USER=${cleanEmail}`);
          userUpdated = true;
        } else if (line.startsWith("SMTP_PASS=")) {
          updatedLines.push(`SMTP_PASS=${cleanPassword}`);
          passUpdated = true;
        } else {
          updatedLines.push(line);
        }
      }

      if (!serviceUpdated) updatedLines.push(`SMTP_SERVICE=gmail`);
      if (!userUpdated) updatedLines.push(`SMTP_USER=${cleanEmail}`);
      if (!passUpdated) updatedLines.push(`SMTP_PASS=${cleanPassword}`);

      fs.writeFileSync(envPath, updatedLines.join("\n").trim() + "\n", "utf-8");
      console.log("💾 Faylka .env waa la cusbooneysiiyay si guul leh!");
      console.log("\n🎉 Hadda laga bilaabo, qof kasta oo sign-up sameeya koodhka wuxuu toos ugu dhacayaa GMAIL-KIISA DHABTA AH!");

    } catch (err) {
      console.log("\n❌ Cilad ayaa dhacday! Gmail-ku wuu diiday inuu xirmo.");
      console.log("Error details:", err.message);
      console.log("\n💡 TALO bixin:");
      console.log("1. Hubi in email-kaagu sax yahay.");
      console.log("2. Hubi in App Password-ka aad qortay uu sax yahay (oo aadan isticmaalin password-kaaga caadiga ah).");
      console.log("3. Hubi in '2-Step Verification' ay ka shidantahay akoonkaaga Google.");
    } finally {
      rl.close();
    }
  });
});
