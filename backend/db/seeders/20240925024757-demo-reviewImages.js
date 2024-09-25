// backend/db/seeders/20240925024757-demo-reviewImages
"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "https://cdn.prod.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
      },
      {
        reviewId: 1,
        url: "https://cdn.prod.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
      },
      {
        reviewId: 2,
        url: "https://cdn.prod.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
      },
      {
        reviewId: 2,
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJPV2jLOg5CGXMwzL9huLEzrc1YbfkE9tkow&s",
      },
      {
        reviewId: 3,
        url: "https://cdn.prod.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
      },
      {
        reviewId: 3,
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJPV2jLOg5CGXMwzL9huLEzrc1YbfkE9tkow&s",
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
