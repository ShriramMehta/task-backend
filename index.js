const app = require("./app");
const config = require("./config/config");
const PORT = config.PORT;

// Start the app and listen on the defined port
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
