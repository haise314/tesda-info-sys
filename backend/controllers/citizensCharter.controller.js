import CitizensCharter from "../models/citizenscharter.model.js";

export const createCitizensCharter = async (req, res) => {
  try {
    const citizensCharter = new CitizensCharter(req.body);
    await citizensCharter.save();
    res.status(201).json(citizensCharter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCitizensCharters = async (req, res) => {
  try {
    const citizensCharters = await CitizensCharter.find();
    res.status(200).json(citizensCharters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCitizensCharterById = async (req, res) => {
  try {
    const citizensCharter = await CitizensCharter.findById(req.params.id);
    if (!citizensCharter) {
      return res.status(404).json({ message: "Citizens Charter not found" });
    }
    res.status(200).json(citizensCharter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCitizensCharter = async (req, res) => {
  try {
    const citizensCharter = await CitizensCharter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!citizensCharter) {
      return res.status(404).json({ message: "Citizens Charter not found" });
    }
    res.status(200).json(citizensCharter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCitizensCharter = async (req, res) => {
  try {
    const citizensCharter = await CitizensCharter.findByIdAndDelete(
      req.params.id
    );
    if (!citizensCharter) {
      return res.status(404).json({ message: "Citizens Charter not found" });
    }
    res.status(200).json({ message: "Citizens Charter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCitizenCharter = async (req, res) => {
  try {
    const feedback = await CitizensCharter.find();
    res.status(200).json({
      success: true,
      message: "Citizens charter feedback retrieved successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
