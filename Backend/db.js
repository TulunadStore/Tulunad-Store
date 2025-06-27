// tulunad-backend/db.js

require('dotenv').config(); // Load environment variables

// Change: Require mysql2 instead of mysql
const mysql = require('mysql2'); // IMPORTANT: Now using mysql2

// Create a connection pool (API is very similar to 'mysql' package's pool)
const pool = mysql.createPool({
    connectionLimit : 10, // Max number of connections in the pool
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASSWORD,
    database        : process.env.DB_NAME,
    waitForConnections: true, // If true, connection requests are queued if no connection is available.
    connectionLimit: 10, // The maximum number of connections to create at once.
    queueLimit: 0 // The maximum number of requests the pool will queue before returning an error. (0 = no limit)
});

// Test the connection pool (optional, but good for initial verification)
pool.getConnection((err, connection) => {
    if (err) {
        // This 'err' means there was an issue getting a connection from the pool
        // This is usually due to incorrect credentials, host, or the MySQL server not running
        console.error('Error connecting to MySQL pool:', err.stack);
        return;
    }
    console.log('Successfully connected to MySQL database pool as ID ' + connection.threadId);
    connection.release(); // Release the connection back to the pool immediately after testing
});

// Add error handling for the pool itself
pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

pool.on('error', function(err) {
    console.error('MySQL Pool Error:', err.code, err.message); // Log error code and message
    // Implement more specific error handling here if needed
    // E.g., if (err.code === 'PROTOCOL_CONNECTION_LOST')
});


// Modify module.exports to provide queries directly from the pool
// This makes sure every query uses a fresh connection from the pool,
// or requests a new one if available.
module.exports = {
    query: (sql, args, callback) => {
        // mysql2's pool.query returns a promise by default,
        // but it also supports the callback pattern for compatibility with the old 'mysql' module.
        // We'll stick to the callback pattern for consistency with existing controllers.
        return pool.query(sql, args, callback);
    },
    // Transaction methods need to explicitly get a connection and manage it
    beginTransaction: (callback) => {
        pool.getConnection((err, connection) => {
            if (err) return callback(err);
            connection.beginTransaction((err) => {
                if (err) {
                    connection.release();
                    return callback(err);
                }
                callback(null, connection); // Pass the connection back for subsequent queries
            });
        });
    },
    commit: (connection, callback) => {
        connection.commit((err) => {
            if (err) {
                // If commit fails, attempt to rollback
                return connection.rollback(() => {
                    connection.release(); // Release connection after rollback
                    callback(err);
                });
            }
            connection.release(); // Release connection after successful commit
            callback(null);
        });
    },
    rollback: (connection, callback) => {
        connection.rollback(() => {
            connection.release(); // Always release connection after rollback
            callback(null);
        });
    }
};
