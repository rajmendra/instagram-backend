const getAllStatusLikesAndComments = async (req, res) => {
  try {
    const statusCounts = await Status.aggregate([
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "statusId",
          as: "likes"
        }
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "statusId",
          as: "comments"
        }
      },
      {
        $project: {
          _id: 1,
          totalLikes: { $size: "$likes" },
          totalComments: { $size: "$comments" }
        }
      }
    ]);

    res.json(statusCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
