/* eslint-disable no-undef */

const { logIn } = require("../controllers/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models/user");

describe("login controllers test", () => {
  const user = {
    _id: "1",
    email: "testUser.mail.com",
    password: "test",
    subscription: "pro",
    code: 200,
  };
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  user.token = token;
  const mReq = user;

  const mRes = {};
  const mockNext = jest.fn();

  jest.spyOn(User, "findOne").mockImplementationOnce(() => user);

  logIn(mReq, mRes, mockNext);
  it("should return status-code - 200", () => {
    expect(mReq.code).toEqual(user.code);
  });

  it("should return token", () => {
    expect(mReq.token).toEqual(user.token);
  });

  it("should return user object", () => {
    expect({ email: mReq.email, subscription: mReq.subscription }).toEqual({
      email: user.email,
      subscription: user.subscription,
    });
  });

  it("should call next() with error in case authorization header is absent", () => {
    const mReq = {
      headers: {},
    };
    const mRes = {};

    logIn(mReq, mRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
