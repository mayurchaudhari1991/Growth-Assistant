require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const axios = require("axios");

const token = process.env.LINKEDIN_ACCESS_TOKEN;
console.log("Token prefix:", token?.substring(0, 20) + "...");

async function tryEndpoint(label, url, headers) {
  try {
    const res = await axios.get(url, { headers });
    console.log(`\n✅ [${label}] Status: ${res.status}`);
    console.log("Response:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log(`\n❌ [${label}] Status: ${err.response?.status}`);
    console.log("Error:", JSON.stringify(err.response?.data, null, 2));
  }
}

(async () => {
  const base = {
    Authorization: `Bearer ${token}`,
    "X-Restli-Protocol-Version": "2.0.0",
  };

  await tryEndpoint("v2/me (basic)", "https://api.linkedin.com/v2/me", base);
  await tryEndpoint(
    "v2/me (id only)",
    "https://api.linkedin.com/v2/me?projection=(id)",
    base,
  );
  await tryEndpoint("v2/userinfo", "https://api.linkedin.com/v2/userinfo", {
    Authorization: `Bearer ${token}`,
  });
  await tryEndpoint(
    "v2/people/~",
    "https://api.linkedin.com/v2/people/~:(id)",
    base,
  );

  // OAuth introspection (already tried, no member ID)
  console.log("\n--- API v2 Token Introspection ---");
  try {
    const params = new URLSearchParams({
      token,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    });
    const r = await axios.post(
      "https://api.linkedin.com/v2/introspectToken",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      },
    );
    console.log("✅ API Introspection:", JSON.stringify(r.data, null, 2));
  } catch (e) {
    console.log(
      "❌ API Introspection:",
      e.response?.status,
      JSON.stringify(e.response?.data),
    );
  }

  // Try v2/me with LinkedIn-Version header
  console.log("\n--- v2/me with LinkedIn-Version ---");
  try {
    const r = await axios.get("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202410",
      },
    });
    console.log("✅:", JSON.stringify(r.data, null, 2));
  } catch (e) {
    console.log("❌:", e.response?.status, JSON.stringify(e.response?.data));
  }

  // Token introspection - works with any scope
  console.log("\n--- Token Introspection ---");
  try {
    const params = new URLSearchParams({
      token,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    });
    const r = await axios.post(
      "https://www.linkedin.com/oauth/v2/introspectToken",
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );
    console.log("✅ Introspection:", JSON.stringify(r.data, null, 2));
  } catch (e) {
    console.log(
      "❌ Introspection:",
      e.response?.status,
      JSON.stringify(e.response?.data),
    );
  }
})();
