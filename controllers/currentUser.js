async function getCurrentUser(req, res, next) {
  try {
    const { email, subscription } = req.user;
    res.json({
      status: "success",
      code: 200,
      user: {
        email,
        subscription,
      },
    });
  } catch (err) {
    next(err);
  }
}
module.exports = { getCurrentUser };
