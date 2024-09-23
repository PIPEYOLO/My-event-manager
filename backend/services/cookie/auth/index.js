import jwt from "jsonwebtoken";

const algorithm = "HS256";
const tokenValidity = 1000 * 60 * 60 * 24 * 30;


// Token management
export function createTokenFromUserInfo(info) {
  return jwt.sign(info, process.env.JWT_SECRET, { expiresIn: tokenValidity, algorithm });
}


export function decipherToken(tokenString) {
  let tokenData;
  try {
    tokenData = jwt.verify(tokenString, process.env.JWT_SECRET, { algorithms: [algorithm] });
  }
  catch(error) {
    return { success: false };
  }

  return { success: true, data: tokenData};
}

// Cookie 
export function setTokenCookie(res, token) {
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
    maxAge: tokenValidity, 
    sameSite: "strict"
  });
}

export function getTokenCookie(req) {
  return req.cookies["authToken"];
}

export function clearAllCookies(res) {
  res.clearCookie("authToken");
  res.clearCookie("_id");
  res.clearCookie("name");
}

// User authorization info management in request:
export function setUserAuthInfo(req, authInfo) {
  req.user = authInfo;
}

export function getUserAuthInfo(req) {
  return req.user;
}
