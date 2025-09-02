const express = require("express");
const router = express.Router();
const { verifyCaptcha } = require("../controllers/captchaController");

router.post("/verify-captcha", verifyCaptcha);

module.exports = router;
