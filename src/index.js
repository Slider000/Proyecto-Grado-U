const app = require('./app');
require('./db');
require('./controllers/auth/auth-local')
async function Main() {
    await app.listen(app.get('port'));
}

Main();