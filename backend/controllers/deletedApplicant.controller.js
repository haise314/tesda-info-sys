import DeletedApplicant from "../models/Deleted/deletedApplicant.model.js";

export const getDeletedApplicants = async (req, res) => {
  try {
    const deletedApplicants = await DeletedApplicant.find();
    res.status(200).json(deletedApplicants);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDeletedApplicantById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedApplicant = await DeletedApplicant.findById(id);

    if (!deletedApplicant) {
      return res.status(404).json({ message: "Deleted applicant not found" });
    }

    res.status(200).json(deletedApplicant);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
