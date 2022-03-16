const insertFlights = () => {
    console.log('insertFlights()');
    // What SQL calls tables, MongoDB calls 'collections'
    // What SQL calls table rows, MongoDB calls collection 'documents'
    db.collection('flights').insertMany([
        {
        flight_number: 'BA123',
        origin: 'SYD',
        destination: 'MEL',
        departure_date: new Date('2022-03-20T04:20:00Z'),
        // nested data instead of an ID (association) for a belongs_to
        airplane: { name: '737 Max', rows: 20, cols: 6 },
        // As above, we can store a has_many as nested data here,
        // this time an array of reservation objects...
        // BUT since we will almost certainly want to be able to see
        // reservations in a different context, i.e. "what are all the
        // reservations for a specific user", we WILL eventually want to
        // make this into a list of Reservation IDs, or more likely,
        // each User document will contain a duplicated ("denormalized")
        // list of reservations for that user, which will link back to
        // this Flight using the flight ID
        reservations: [
            { row: 1, col: 1, user_id: 10 }, // NOT real user_ids yet!
            { row: 2, col: 2, user_id: 10 },
            { row: 3, col: 3, user_id: 11 }
        ], // reservations[]
        }, // end of flight #1
        {
        flight_number: 'BA456',
        origin: 'SYD',
        destination: 'MEL',
        departure_date: new Date('2022-03-21T04:20:00Z'),
        airplane: { name: '767', rows: 16, cols: 4 },
        reservations: [
            { row: 1, col: 1, user_id: 10 }, // NOT real user_ids yet!
            { row: 1, col: 2, user_id: 10 },
            { row: 1, col: 3, user_id: 11 }
        ], // reservations[]
        }, // end of flight #2
    ],  // end of 1st arg to insertMany, i.e. the array of flight objects
    (err, result) => {
        if( err ) {
        return console.log('Error adding flights', err);
        }
        console.log(`Success! Added ${ result.insertedCount } flights.`);
        // process.exit( 0 ); // exit the Node.js program signalling no errors
        printFlights();
    } // 'finished' callback
    ); // insertMany()
}; // insertFlights()
const printFlights = () => {
    // Like ActiveRecord Flight.all
    db.collection('flights').find().toArray( (err, flights) => {
        if( err ){
        return console.log('Error finding flights:', err);
        }
        console.log('Flights:', flights);
        process.exit(0); // quit the program, no errors
    }); // .find().toArray()
}; // printFlights();