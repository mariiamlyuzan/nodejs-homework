const app = require("./app");

app.listen(3000, (error) => {
  if (error) console.log("Error server", error);
  console.log("Server running. Use our API on port: 3000");
});
