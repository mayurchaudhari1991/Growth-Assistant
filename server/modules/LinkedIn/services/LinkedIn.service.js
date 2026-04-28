const axios = require("axios");
const fs = require("fs");
const path = require("path");
const env = require("../../../lib/config/env");
const {
  LINKEDIN_API_BASE,
  LINKEDIN_REST_BASE,
  LINKEDIN_API_VERSION,
  LINKEDIN_AUTH_URL,
  LINKEDIN_TOKEN_URL,
  LINKEDIN_SCOPES,
} = require("../../../lib/config/constants");

function restHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "LinkedIn-Version": LINKEDIN_API_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
  };
}

class LinkedInService {
  getAuthUrl(state) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: env.linkedin.clientId,
      redirect_uri: env.linkedin.redirectUri,
      state: state || "random_state_string",
      scope: LINKEDIN_SCOPES.join(" "),
    });
    return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCodeForToken(code) {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: env.linkedin.redirectUri,
      client_id: env.linkedin.clientId,
      client_secret: env.linkedin.clientSecret,
    });

    const response = await axios.post(LINKEDIN_TOKEN_URL, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  }

  async getPersonUrn(accessToken) {
    try {
      const response = await axios.get(`${LINKEDIN_API_BASE}/userinfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const sub = response.data?.sub;
      if (sub) {
        console.log("[LinkedIn] Got sub from /v2/userinfo:", sub);
        return `urn:li:person:${sub}`;
      }
    } catch (err) {
      console.warn(
        "[LinkedIn] /v2/userinfo failed:",
        err.response?.data || err.message,
      );
    }
    throw new Error(
      "Could not retrieve LinkedIn person URN from /v2/userinfo. Ensure openid+profile scopes are granted.",
    );
  }

  async publishPost(post) {
    const token = env.linkedin.accessToken;
    const personUrn = env.linkedin.personUrn;

    if (!token)
      throw new Error(
        "LinkedIn access token not configured. Please connect via /auth/linkedin",
      );
    if (!personUrn)
      throw new Error(
        "LinkedIn person URN not configured. Please reconnect via /auth/linkedin",
      );

    let imageUrn = null;
    if (post.imageUrl) {
      imageUrn = await this._uploadImage(post.imageUrl, token, personUrn);
    }

    const restPost = {
      author: personUrn,
      commentary: post.content,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
      ...(imageUrn && {
        content: {
          media: {
            title: post.title.substring(0, 200),
            id: imageUrn,
          },
        },
      }),
    };

    console.log("[LinkedIn] Posting to /rest/posts with author:", personUrn);

    let response;
    try {
      response = await axios.post(`${LINKEDIN_REST_BASE}/posts`, restPost, {
        headers: restHeaders(token),
      });
    } catch (axiosErr) {
      const liError = axiosErr.response?.data;
      console.error("[LinkedIn] API Error:", JSON.stringify(liError, null, 2));
      throw new Error(
        `LinkedIn API error ${axiosErr.response?.status}: ${liError?.message || liError?.serviceErrorCode || JSON.stringify(liError) || axiosErr.message}`,
      );
    }

    const postId =
      response.headers["x-linkedin-id"] ||
      response.headers["x-restli-id"] ||
      response.data?.id ||
      "unknown";
    console.log(`[LinkedIn] Post published via /rest/posts. ID: ${postId}`);
    return postId;
  }

  async getFollowerCount() {
    const token = env.linkedin.accessToken;
    const personUrn = env.linkedin.personUrn;
    if (!token || !personUrn) return null;

    try {
      const encodedUrn = encodeURIComponent(personUrn);
      const response = await axios.get(
        `${LINKEDIN_REST_BASE}/networkSizes/${encodedUrn}?edgeType=FOLLOWED_BY`,
        { headers: restHeaders(token) }
      );
      return response.data?.firstDegreeSize || 0;
    } catch (err) {
      if (err.response?.status === 403) {
        console.warn("[LinkedIn] Follower count access denied. This API requires 'Marketing Developer Platform' or 'Community Management' permissions in your LinkedIn App.");
      } else {
        console.warn("[LinkedIn] Failed to fetch follower count:", err.response?.data || err.message);
      }
      return null;
    }

  }

  async _uploadImage(imageUrl, accessToken, personUrn) {

    try {
      const initRes = await axios.post(
        `${LINKEDIN_REST_BASE}/images?action=initializeUpload`,
        { initializeUploadRequest: { owner: personUrn } },
        { headers: restHeaders(accessToken) },
      );

      const uploadUrl = initRes.data?.value?.uploadUrl;
      const imageUrn = initRes.data?.value?.image;

      if (!uploadUrl || !imageUrn) throw new Error("No upload URL returned");

      const imageRes = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        timeout: 15000,
      });

      await axios.put(uploadUrl, imageRes.data, {
        headers: { "Content-Type": "application/octet-stream" },
      });

      console.log(`[LinkedIn] Image uploaded: ${imageUrn}`);
      return imageUrn;
    } catch (err) {
      console.warn(
        "[LinkedIn] Image upload failed, posting text-only:",
        err.message,
      );
      return null;
    }
  }

  getConnectionStatus() {
    return {
      configured: !!(env.linkedin.clientId && env.linkedin.clientSecret),
      connected: !!(env.linkedin.accessToken && env.linkedin.personUrn),
      personUrn: env.linkedin.personUrn || null,
    };
  }

  persistTokenToEnv(accessToken, personUrn) {
    const envPath = path.join(__dirname, "../../../.env");
    try {
      let content = fs.readFileSync(envPath, "utf8");
      content = content
        .replace(
          /^LINKEDIN_ACCESS_TOKEN=.*/m,
          `LINKEDIN_ACCESS_TOKEN=${accessToken}`,
        )
        .replace(
          /^LINKEDIN_PERSON_URN=.*/m,
          `LINKEDIN_PERSON_URN=${personUrn}`,
        );
      fs.writeFileSync(envPath, content, "utf8");

      env.linkedin.accessToken = accessToken;
      env.linkedin.personUrn = personUrn;
    } catch (err) {
      console.warn("[LinkedIn] Could not persist token to .env:", err.message);
    }
  }
}

module.exports = new LinkedInService();
