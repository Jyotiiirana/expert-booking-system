const Expert = require("../models/Expert");

const getExperts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 6;

    const search = req.query.search || "";
    const category = req.query.category || "";

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const experts = await Expert.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Expert.countDocuments(query);

    res.json({
      experts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch experts",
    });
  }
};

const getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({
        message: "Expert not found",
      });
    }

    res.json(expert);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expert",
    });
  }
};

module.exports = {
  getExperts,
  getExpertById,
};