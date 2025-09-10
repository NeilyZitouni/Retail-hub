const { StatusCodes } = require("http-status-codes");
const Product = require("../models/products");

const Searchtest = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "you must provide a query parameter" });
  }
  const result = await Product.aggregate([
    {
      $search: {
        index: "default_1",
        text: {
          query: q,
          path: ["name", "description", "brand", "category", "subCategory"],
          fuzzy: {
            maxEdits: 2,
            prefixLength: 1,
            maxExpansions: 50,
          },
        },
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        brand: 1,
        score: { $meta: "searchScore" },
      },
    },
    { $sort: { score: -1 } },
  ]);
  res.status(StatusCodes.OK).json({ nbHits: result.length, result });
};

module.exports = Searchtest;
