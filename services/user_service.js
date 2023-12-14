module.exports = {
  // Add the following function to your service file
  getUserProfile: async (userId) => {
    return new Promise((resolve, reject) => {
      connectionPool.getConnection((err, connection) => {
        if (err) {
          console.log(
            "Error in creating connection in getUserProfile service",
            err
          );
          reject(err);
          return;
        }
        try {
          const getUserProfileQuery =
            "SELECT user_id, full_name, email, phone_number, profile_picture, wallet_balance, DATE_FORMAT(registered_on, '%Y-%m-%d') as registered_on, phone_country_code FROM users WHERE user_id = ?";
          connection.query(getUserProfileQuery, [userId], (err, result) => {
            if (err) {
              console.log("Error in query in getUserProfile:", err);
              reject(err);
              return;
            }
            resolve(result[0]); // Assuming user_id is unique, so we expect only one result
          });
        } catch (error) {
          console.log("Error in query in getUserProfile:", error);
          reject(error);
        } finally {
          console.log("Connection is released for getUserProfile");
          connection.release();
        }
      });
    });
  },
  findUserByPhoneNo: async ({ phone, phone_country_code }) => {
    return new Promise((resolve, reject) => {
      let connection;
      try {
        connectionPool.getConnection((err, conn) => {
          if (err) throw err;

          connection = conn;
          // console.log("Connection established.");

          const selectQuery =
            "SELECT * FROM users WHERE phone_number = ? and phone_country_code =?";
          connection.query(
            selectQuery,
            [phone, phone_country_code],
            (err, results) => {
              if (err) {
                throw err;
              }

              if (results.length === 0) {
                resolve(false);
              } else {
                resolve(results[0]);
              }
            }
          );
        });
      } catch (error) {
        reject(error);
      } finally {
        if (connection) {
          connection.release();
          // console.log("Connection released.");
        }
      }
    });
  },

  createUser: async ({ name, phone, phone_country_code }) => {
    return new Promise((resolve, reject) => {
      let connection;
      try {
        connectionPool.getConnection((err, conn) => {
          if (err) throw err;

          connection = conn;
          // console.log("Connection established.");

          const insertQuery =
            "INSERT INTO users (full_name, phone_number,phone_country_code, registered_on) VALUES (?, ?, ?,NOW())";

          connection.query(
            insertQuery,
            [name, phone, phone_country_code],
            (err, results) => {
              if (err) {
                console.log(err);
                reject(err);
              }

              // Retrieve the ID of the newly created record
              const newUserId = results.insertId;
              resolve(newUserId);
            }
          );
        });
      } catch (error) {
        console.log(error);
        reject(error);
      } finally {
        if (connection) {
          connection.release();
          // console.log("Connection released.");
        }
      }
    });
  },
  getAllUsersWithAddresses: async () => {
    return new Promise((resolve, reject) => {
      connectionPool.getConnection((err, connection) => {
        if (err) {
          console.log(
            "Error in creating connection in getAllUsersWithAddresses service",
            err
          );
          reject(err);
          return;
        }

        try {
          const getUsersQuery = `
                        SELECT u.*, a.street_address, a.city, a.state, a.postal_code, 
                               a.country, a.building_address, a.landmark ,a.phone,a.name
                        FROM users u
                        LEFT JOIN user_addresses a ON u.user_id = a.user_id
                    `;

          connection.query(getUsersQuery, [], (err, results) => {
            if (err) {
              console.log("Error in query in getAllUsersWithAddresses:", err);
              reject(err);
              return;
            }

            resolve(results);
          });
        } catch (error) {
          console.log("Error in getAllUsersWithAddresses:", error);
          reject(error);
        } finally {
          console.log("Connection is released for getAllUsersWithAddresses");
          connection.release();
        }
      });
    });
  },
  getAllUserIds: async () => {
    return new Promise((resolve, reject) => {
      connectionPool.getConnection((err, connection) => {
        if (err) {
          console.log(
            "Error in creating connection in getAllUserIds service",
            err
          );
          reject(err);
          return;
        }

        try {
          const getUsersQuery = `
                        SELECT full_name,user_id from users
                      
                    `;

          connection.query(getUsersQuery, [], (err, results) => {
            if (err) {
              console.log("Error in query in getAllUserIds:", err);
              reject(err);
              return;
            }

            resolve(results);
          });
        } catch (error) {
          console.log("Error in getAllUserIds:", error);
          reject(error);
        } finally {
          console.log("Connection is released for getAllUserIds");
          connection.release();
        }
      });
    });
  },

  sendSMS: async ({ body, to }) => {
    return new Promise((resolve, reject) => {
      client.messages
        .create({
          body: body,
          from: "+12512702352",
          to: to,
        })
        .then((message) => resolve(message.sid))
        .catch((error) => reject(error));
    });
  },

  sendWhatsAppMessage: async ({ to, templateName }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const url = "https://graph.facebook.com/v17.0/164916143367055/messages";
        const headers = {
          Authorization:
            "Bearer EAAOtS1nOdGEBO3CvQR1y7ZALYHfEDVrVUBGdmxVLIjtOL8qwev3OZABsA10j3SLlaXuaZAFw3QAJKtjpYn3QUbmiqnH3HwW2YvDGCiMEyBguK4Jks7Xnm3JrVYDZAn6uGmbePc8JvAp7M2xZBmcVwLt8vbqxIsK9pT6WQkFobsA4nCdCyiNxS5KFZCHitMFBZBUBNIxc2s5tn2rAKNhIbcZD",
          "Content-Type": "application/json",
        };
        const data = {
          messaging_product: "whatsapp",
          to: to,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: "en_US",
            },
          },
        };
        const response = await axios.post(url, data, { headers: headers });
        console.log(response);
        if (
          response.data &&
          response.data.messages &&
          response.data.messages[0] &&
          response.data.messages[0].message_id
        ) {
          resolve(response.data.messages[0].message_id);
        } else {
          reject("Failed to send message.");
        }
      } catch (error) {
        console.log("Error sending WhatsApp message:", error);
        reject(error);
      }
    });
  },
};
