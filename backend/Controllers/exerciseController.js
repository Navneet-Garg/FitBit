const Exercise = require('../Model/Exercise');
const User = require('../Model/User');

const saveExercise = async (req, res) => {
  try {
    const { exercise, count } = req.body;
    const userId = req.userId; // Ensure this is set from middleware
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format

    console.log("Saving exercise for user:", userId, "on", today);

    if (!exercise || count === undefined) {
      return res.status(400).json({ success: false, message: 'Exercise and count are required' });
    }

    // Find or create the daily exercise record
    let exerciseRecord = await Exercise.findOne({ user: userId, date: today });

    if (!exerciseRecord) {
      // Create a new record with all exercises set to 0
      exerciseRecord = new Exercise({
        user: userId,
        date: today,
        exercises: { pushups: 0, squats: 0, bicep_curl: 0, shoulder_taps: 0 }
      });
    }

    // Update only the relevant exercise count
    exerciseRecord.exercises[exercise] = count;
    await exerciseRecord.save();

    res.status(201).json({
      success: true,
      message: 'Exercise saved successfully',
      data: exerciseRecord
    });
  } catch (error) {
    console.error('Error saving exercise:', error);
    res.status(500).json({ success: false, message: 'Error saving exercise', error: error.message });
  }
};

const getExerciseHistory = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Fetching exercise history for user:", userId);

    const history = await Exercise.find({ user: userId })
      .sort({ date: -1 }) // Most recent first
      .limit(10); // Limit to last 10 days

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching exercise history:', error);
    res.status(500).json({ success: false, message: 'Error fetching exercise history', error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Exercise.aggregate([
      {
        $group: {
          _id: "$user",
          totalReps: {
            $sum: {
              $add: [
                "$exercises.pushups",
                "$exercises.squats",
                "$exercises.bicep_curl",
                "$exercises.shoulder_taps"
              ]
            }
          }
        }
      },
      { $sort: { totalReps: -1 } },
      { $limit: 10 }
    ]);

    // Populate user data (username)
    const populatedLeaderboard = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await User.findById(entry._id).select("name");
        return {
          name: user ? user.name : "Unknown",
          totalReps: entry.totalReps
        };
      })
    );

    res.status(200).json(populatedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getLeaderboard, saveExercise, getExerciseHistory };