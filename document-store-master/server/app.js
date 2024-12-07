const express = require('express');
const app = express();
const cors = require('cors');

const connectDB = require('./configs/database');
const router = require('./routers');

app.use(cors());
app.use(express.json());

app.use(express.static('./assets'));

connectDB();
router(app);

app.listen(4000, () => {
  console.log('server run at port 4000');
});
