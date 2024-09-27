// backend/db/seeders/20240924010205-demo-spots
"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123.0,
        // avgRating: 4.5,
        // previewImage: "image url",
      },
      {
        ownerId: 2,
        address: "456 Serenity Street",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 34.0522,
        lng: -118.2437,
        name: "Serenity Haven",
        description:
          "Welcome to Serenity Haven, your peaceful retreat in the heart of nature.",
        price: 150.0,
        // avgRating: 4.8,
        // previewImage: "image url",
      },
      {
        ownerId: 3,
        address: "789 Woodland Ave",
        city: "Santa Cruz",
        state: "California",
        country: "United States of America",
        lat: 37.3328,
        lng: -74.006,
        name: "Learn Hub",
        description:
          "Experience the magic of nature in the Tranquil Treehouse, an enchanting escape perched among the treetops.",
        price: 200.0,
        // avgRating: 4.7,
        // previewImage: "learn-hub-image-url",
      },
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, null, {}); 
  },
};
