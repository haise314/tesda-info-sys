import DeletedRegistrant from "../models/Deleted/deletedRegistrant.model.js";

export const getDeletedRegistrants = async (req, res) => {
  try {
    const deletedRegistrants = await DeletedRegistrant.find();
    res.status(200).json(deletedRegistrants);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDeletedRegistrantById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRegistrant = await DeletedRegistrant.findById(id);

    if (!deletedRegistrant) {
      return res.status(404).json({ message: "Deleted registrant not found" });
    }

    res.status(200).json(deletedRegistrant);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
