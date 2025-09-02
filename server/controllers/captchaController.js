const axios = require("axios");

const verifyCaptcha = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Captcha token is missing." });
  }

  try {
    const response = await axios.post(
      `https://hcaptcha.com/siteverify`,
      `response=${token}&secret=${process.env.HCAPTCHA_SECRET_KEY}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (response.data.success) {
      res.json({ success: true });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Captcha verification failed." });
    }
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error verifying captcha." });
  }
};

module.exports = { verifyCaptcha };
