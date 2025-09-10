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
            prefixLength: 0,
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

const Searchtest2 = async (req, res) => {
  const {
    q,
    name,
    brand,
    priceCategory,
    category,
    subCategory,
    minPrice,
    maxPrice,
    sortBy = "score",
    sortOrder = -1,
    limit = 100,
    skip = 0,
  } = req.query;

  const pipeline = [];

  // Step 1: Text search
  const hasTextSearch =
    q || name || brand || priceCategory || category || subCategory;

  if (hasTextSearch) {
    const searchStage = {
      $search: {
        index: "default_1",
        compound: {
          must: [],
          should: [],
        },
      },
    };

    if (q) {
      searchStage.$search.compound.should.push({
        text: {
          query: q,
          path: ["name", "description", "brand", "category", "subCategory"],
          fuzzy: { maxEdits: 2, prefixLength: 0, maxExpansions: 50 },
          score: { boost: { value: 2.0 } },
        },
      });
    }

    if (name) {
      searchStage.$search.compound.must.push({
        text: {
          query: name,
          path: ["name"],
          fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 30 },
          score: { boost: { value: 3.0 } },
        },
      });
    }

    if (brand) {
      searchStage.$search.compound.must.push({
        text: {
          query: brand,
          path: ["brand"],
          fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 30 },
          score: { boost: { value: 2.5 } },
        },
      });
    }

    if (category) {
      searchStage.$search.compound.must.push({
        text: {
          query: category,
          path: ["category"],
          fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 20 },
          score: { boost: { value: 2.0 } },
        },
      });
    }

    if (subCategory) {
      searchStage.$search.compound.must.push({
        text: {
          query: subCategory,
          path: ["subCategory"],
          fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 20 },
          score: { boost: { value: 2.0 } },
        },
      });
    }

    if (priceCategory) {
      searchStage.$search.compound.must.push({
        text: {
          query: priceCategory,
          path: ["priceCategory"],
          fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 10 },
          score: { boost: { value: 1.5 } },
        },
      });
    }

    pipeline.push(searchStage);
  }

  // Step 2: Numeric filters
  const matchConditions = {};
  if (minPrice !== undefined || maxPrice !== undefined) {
    matchConditions.price = {};
    if (minPrice !== undefined) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) matchConditions.price.$gte = min;
    }
    if (maxPrice !== undefined) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) matchConditions.price.$lte = max;
    }
  }

  // If no Atlas Search is used, fall back to regex filters
  if (!hasTextSearch) {
    if (brand) matchConditions.brand = { $regex: brand, $options: "i" };
    if (category)
      matchConditions.category = { $regex: category, $options: "i" };
    if (subCategory)
      matchConditions.subCategory = { $regex: subCategory, $options: "i" };
    if (priceCategory)
      matchConditions.priceCategory = { $regex: priceCategory, $options: "i" };
    if (name) matchConditions.name = { $regex: name, $options: "i" };
  }

  if (Object.keys(matchConditions).length > 0) {
    pipeline.push({ $match: matchConditions });
  }

  // Step 3: Projection
  const projectStage = {
    $project: {
      name: 1,
      description: 1,
      brand: 1,
      category: 1,
      subCategory: 1,
      price: 1,
      priceCategory: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  };

  if (hasTextSearch) {
    projectStage.$project.score = { $meta: "searchScore" };
  }
  pipeline.push(projectStage);

  // Step 4: Sorting
  const sortStage = {};
  if (hasTextSearch && sortBy === "score") {
    sortStage.score = parseInt(sortOrder);
  } else {
    switch (sortBy) {
      case "price":
        sortStage.price = parseInt(sortOrder);
        break;
      case "name":
        sortStage.name = parseInt(sortOrder);
        break;
      case "brand":
        sortStage.brand = parseInt(sortOrder);
        break;
      case "createdAt":
        sortStage.createdAt = parseInt(sortOrder);
        break;
      default:
        if (hasTextSearch) sortStage.score = -1;
        else sortStage.createdAt = -1;
    }
  }
  pipeline.push({ $sort: sortStage });

  // Step 5: Pagination
  if (parseInt(skip) > 0) pipeline.push({ $skip: parseInt(skip) });
  if (parseInt(limit) > 0) pipeline.push({ $limit: parseInt(limit) });

  const result = await Product.aggregate(pipeline);

  let totalCount = null;
  if (skip || limit) {
    const countPipeline = pipeline.slice(0, -2);
    countPipeline.push({ $count: "total" });
    const countResult = await Product.aggregate(countPipeline);
    totalCount = countResult.length > 0 ? countResult[0].total : 0;
  }

  res.status(StatusCodes.OK).json({
    nbHits: result.length,
    result,
    filters: {
      hasTextSearch,
      appliedFilters: {
        q,
        name,
        brand,
        priceCategory,
        category,
        subCategory,
        minPrice,
        maxPrice,
      },
      sorting: { sortBy, sortOrder },
      pagination: { skip: parseInt(skip), limit: parseInt(limit), totalCount },
    },
  });
};

module.exports = {
  Searchtest,
  Searchtest2,
};
