const db = require("../config/db")


const t = require("../models/Tournament")


db.once('open', async () => {
    await t.deleteMany();
})
