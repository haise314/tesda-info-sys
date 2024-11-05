import TrainingCenter from "../models/trainingcenter.model.js";

const getAllCenters = async (req, res) => {
  try {
    const centers = await TrainingCenter.find({});
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCenter = async (req, res) => {
  try {
    const center = new TrainingCenter(req.body);
    const savedCenter = await center.save();
    res.status(201).json(savedCenter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCenter = async (req, res) => {
  try {
    const center = await TrainingCenter.findByIdAndDelete(req.params.id);
    if (!center) {
      return res.status(404).json({ message: "Training center not found" });
    }
    res.json({ message: "Training center deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllCenters, createCenter, deleteCenter };
