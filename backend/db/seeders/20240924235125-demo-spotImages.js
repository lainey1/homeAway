// backend/db/seeders/20240924235125-demo-spotImages
"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "https://cdn.prod.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://www.computerworld.com/wp-content/uploads/2024/03/programming_coding_elements_lines_of_code_development_developers_teamwork_by_dean_mitchell_gettyimages-1055056840_2400x1600-100795791-orig-100918079-orig.jpg",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://cdn.prod.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://www.computerworld.com/wp-content/uploads/2024/03/programming_coding_elements_lines_of_code_development_developers_teamwork_by_dean_mitchell_gettyimages-1055056840_2400x1600-100795791-orig-100918079-orig.jpg",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://cdn.prod.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://www.computerworld.com/wp-content/uploads/2024/03/programming_coding_elements_lines_of_code_development_developers_teamwork_by_dean_mitchell_gettyimages-1055056840_2400x1600-100795791-orig-100918079-orig.jpg",
          preview: false,
        },
      ],
      options
    );
  },
  // async down(queryInterface, Sequelize) {
  //   options.tableName = "SpotImages";
  //   // await queryInterface.dropTable(options);
  //   return queryInterface.bulkDelete(options, null, {});
  // },

  //! TESTING BELOW
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("SpotImages", null, options);
  },
};
