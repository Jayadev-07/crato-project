import express from 'express'; 
import path from 'path'
import { fileURLToPath } from "url"; // Node.js built-in module

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve only the static files form the dist directory
app.use(express.static(path.join(__dirname, "/dist")));


app.get('/health', (req, res) => {
  console.log(req);
  // Check application health here
  if (res.status(200)) {
    console.log(res)
    return res.status(200).send("Ok");

  } else {
    return res.status(500).send('Internal Server Error');
  }
});


app.get("/*", function (req, res) {
  console.log("Express Req : ", req);
  res.sendFile(path.join(__dirname, "dist", "index.html"));

});


// Start the app by listening on the default Heroku port

const port = 3333;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});