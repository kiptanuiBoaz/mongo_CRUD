const {MongoClient} = require("mongodb");
// const BodyParser = require("body-parser");
// const MongoClient = require("mongodb").MongoClient;
// HJx4a0s1q6jW8qDm

// app.use(BodyParser.json());
// app.use(BodyParser.urlencoded({ extended: true }));0;

const main = async() => {
    // connecting to mongo cluster
    const uri = "mongodb+srv://boaz:Serem3636@cluster0.qpvud.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient (uri);

    try {
        // returns a promise
        await client.connect();

       await createListing(client,{
            name:"Pulopa",
            summary:"A tech behometh with usnsolicited monstrocity in the valley",
            bedrooms:"1",
            batherooms:"1"
        })

    }

    catch(err){
        console.error(err)
    } 

    finally{
        await client.close();
    }
    
}
// calling the main function and sending erroer to the console
main().catch(err => console.error(err));

const createListing = async(client,newListing) => {
    // acces the _airbnb db for listings collections and insert newListing
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

    console.log(`New listing created with the followind id: ${result.insertedId}`)
}



const listDbs = async(client) => {
    const databasesList = await client.db().admin().listDatabases();
    console.log ("Databases:");

    databasesList.databases.forEach(db => {
        console.log(`-${db.name}`)
        
    });
}

   


 
// app.get("/", (req, res) => {
//  res.send("Hello World");
// });
 
// app.listen(port, () => {
//  console.log("Server listening on port " + port);
// });



