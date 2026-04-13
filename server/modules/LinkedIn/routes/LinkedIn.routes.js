const express = require("express");
const router = express.Router();
const LinkedInService = require("../services/LinkedIn.service");
const env = require("../../../lib/config/env");

router.get("/", (req, res) => {
  const state = Math.random().toString(36).substring(2);
  const authUrl = LinkedInService.getAuthUrl(state);
  res.redirect(authUrl);
});

router.get("/callback", async (req, res, next) => {
  try {
    const { code, error, error_description } = req.query;

    if (error) {
      return res.redirect(
        `http://localhost:5173/settings?error=${encodeURIComponent(error_description || error)}`,
      );
    }

    const tokenData = await LinkedInService.exchangeCodeForToken(code);
    const accessToken = tokenData.access_token;

    let personUrn = null;
    try {
      personUrn = await LinkedInService.getPersonUrn(accessToken);
    } catch (urnErr) {
      console.warn(
        "[LinkedIn] Could not auto-fetch person URN:",
        urnErr.message,
      );
      personUrn = env.linkedin.personUrn || null;
      if (personUrn)
        console.log("[LinkedIn] Preserving existing URN:", personUrn);
    }

    LinkedInService.persistTokenToEnv(accessToken, personUrn || "");

    if (personUrn) {
      res.redirect("http://localhost:5173/settings?connected=true");
    } else {
      res.redirect(
        "http://localhost:5173/settings?connected=partial&message=Access+token+saved.+Please+add+your+LinkedIn+Person+URN+manually.",
      );
    }
  } catch (err) {
    next(err);
  }
});

router.get("/status", (req, res) => {
  const status = LinkedInService.getConnectionStatus();
  res.json({
    success: true,
    ...status,
    unsplashConfigured: !!process.env.UNSPLASH_ACCESS_KEY,
  });
});

router.post("/disconnect", (req, res) => {
  LinkedInService.persistTokenToEnv("", "");
  res.json({ success: true, message: "LinkedIn disconnected" });
});

// reload
module.exports = router;
