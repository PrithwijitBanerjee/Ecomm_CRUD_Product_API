/** configure enviroment  variables globally  **/
require('dotenv').config();

/** Load app module **/
const app = require('./app');
const PORT = process.env.PORT || 3000;


/** Binding the server with the PORT **/
app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
});
