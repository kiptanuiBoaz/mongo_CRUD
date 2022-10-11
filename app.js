const {MongoClient} = require("mongodb");
// const BodyParser = require("body-parser");
// const MongoClient = require("mongodb").MongoClient;
// HJx4a0s1q6jW8qDm

// app.use(BodyParser.json());
// app.use(BodyParser.urlencoded({ extended: true }));0;

const main = async() => {
    // connecting to mongo cluster
    const uri = "mongodb+srv://boaz:Serem3636@cluster0.qpvud.mongodb.net/?retryWrites=true&w=majority";
    // new mongo instance
    // he MongoClient class is a class that allows for making Connections to MongoDB.
    const client = new MongoClient (uri);

    try {
        // returns a promise
        await client.connect();

        //    await createListing(client,{
        //         name:"Pulopa",
        //         summary:"A tech behometh with usnsolicited monstrocity in the valley",
        //         bedrooms:"1",
        //         batherooms:"1"
        //     })
            
        // await createMultipleListings(client,
        //     [
        //         {
        //             name: "Infinite Views",
        //             summary: "Modern home with infinite views from the infinity pool",
        //             property_type: "House",
        //             bedrooms: 5,
        //             bathrooms: 4.5,
        //             beds: 5
        //         },
        //         {
        //             name: "Private room in London",
        //             property_type: "Apartment",
        //             bedrooms: 1,
        //             bathroom: 1
        //         },
        //         {
        //             name: "Beautiful Beach House",
        //             summary: "Enjoy relaxed beach living in this house with a private beach",
        //             bedrooms: 4,
        //             bathrooms: 2.5,
        //             beds: 7,
        //             last_review: new Date()
        //         }
        //     ]
        // )

        // await findOneListingByName(client, "Infinite View");
        // await findMinBrAndLatestReviews(client, {
        //     minNoOfBathrooms:2,
        //     minNoOfBedrooms:3,
        //     maxNoOfResults:5,
        // });

        // await updateListingByName(client, "Infinite Views", {bedrooms:8, beds:6})

        // await upsertListingByName (client, "Cozy Cottage",{name:"Cozy Cottage", bedrooms:2, bathrooms:2})
        // await addTypeFied (client);

        await deleteByName(client,"Cozy Cottage");

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

const deleleteListingBeforeDate = async (client,date) => {

}

const deleteByName = async (client, nameOfListing) => {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne({name:nameOfListing});
    console.log(`${result.deletedCount} document(s) was /were deleted`);

}

const addTypeFied = async (client) =>{
    // check if property type field exists and if not add it
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({property_type:{$exists: false}}, {$set:{property_type:"unknown"}});
    console.log(`${result.matchedCount} matched the query criteria`);
    console.log(`${result.modifiedCount} was/were updated`)

}

const upsertListingByName = async (client, nameOfListing, updatedListing) =>{

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name:nameOfListing},{$set:updatedListing},
    {upsert:true})

    console.log(`${result.matchedCount} document(s) matched the query criteria`)

    result.upsertedCont > 0 ? console.log(`One document was insertd with the Id ${result.upsertedId}`)
    : console.log(`${result.modifiedCount} document(s) was/were updated`)


}

const updateListingByName = async (client, nameOfListing, updatedListing) => {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name:nameOfListing},{$set:updatedListing})

    console.log(`${result.matchedCount} document(s) matched the query criteria`)
    console.log(`${result.matchedCount} document(s) was updated`)
}

// find documents in a db with queries provided
const findMinBrAndLatestReviews = async (client, {
    // passing the arguments
    minNoOfBathrooms = 0,
    minNoOfBedrooms =0,
    maxNoOfResults = Number.MAX_SAFE_INTEGER,
    } = {}) => {
        // find returns a cursor

        const cursor = client.db("sample_airbnb").collection("listingsAndReviews").
            find({
                // $gte operatore meaning greater of equal to
                bedrooms: {$gte :minNoOfBedrooms},
                bathrooms: {$gte :minNoOfBathrooms}

            })
            // cursor defines how the results will look like , in this case it comes in descending oreder
            .sort({last_review: -1})
            // setting the number of results to be returned
            .limit(maxNoOfResults)
        ;

const results = await cursor.toArray();



    
        //  * Print Airbnb listings with a minimum number of bedrooms and bathrooms.
        //  * Results will be limited to the designated maximum number of results.
        //  * Results will be sorted by the date of the last review in descending order.
        //  * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
        //  * @param {object} queryParams The query params object
        //  * @param {number} queryParams.minimumNumberOfBedrooms The minimum number of bedrooms
        //  * @param {number} queryParams.minimumNumberOfBathrooms The minimum number of bathrooms
        //  * @param {number} queryParams.maximumNumberOfResults The maximum number of Airbnb listings to be printed
     
    // Print the results
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minNoOfBedrooms} bedrooms and ${minNoOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }

}

const findOneListingByName = async (client,nameOfListing) => {
    // searching through an array of objects and return a result
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name:nameOfListing});
    result ? 
        console.log(`found a listing in the collection with the name ${nameOfListing}`)  
        : console.log(`Result was not found with the name ${nameOfListing}`)
    ;

    console.log(result)
}

const  createMultipleListings = async (client,newListings) => {
    // insert and array of objects into a  collectiion
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);
    console.log(`${result.insertedCount} created with the following id(s): `);
    console.log(result.insertedIds)
}

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



