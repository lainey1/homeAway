// backend/db/seeders/####-demo-spots.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Spots", [
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
        avgRating: 4.5,
        previewImage: "image url",
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
          "Welcome to Serenity Haven, your peaceful retreat in the heart of nature. Nestled among lush greenery, this charming home offers a perfect escape from the hustle and bustle of everyday life. Enjoy the cozy living spaces, fully equipped kitchen, and a private garden where you can unwind with a good book or sip your morning coffee. With modern amenities and thoughtful touches throughout, Serenity Haven is designed for relaxation and rejuvenation. Whether you’re exploring local trails or simply enjoying the tranquil surroundings, this is the ideal spot for your next getaway.",
        price: 150.0,
        avgRating: 4.8,
        previewImage: "image url",
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
          "Experience the magic of nature in the Tranquil Treehouse, an enchanting escape perched among the treetops. This unique home features panoramic views and a cozy atmosphere, perfect for a romantic getaway or a family adventure. With spacious living areas, a fully equipped kitchen, and an outdoor deck, you can immerse yourself in the sights and sounds of the forest. Relax in the hammock, explore nearby hiking trails, or simply enjoy the serenity of your surroundings. The Tranquil Treehouse offers a one-of-a-kind experience that brings you closer to nature while providing all the comforts of home.",
        price: 200.0,
        avgRating: 4.7,
        previewImage: "learn-hub-image-url",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
