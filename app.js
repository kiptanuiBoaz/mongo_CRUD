const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));0;
 
app.get("/", (req, res) => {
 res.send("Hello World");
});
 
app.listen(port, () => {
 console.log("Server listening on port " + port);
});



