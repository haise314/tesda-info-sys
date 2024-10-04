// File: /UpdateRegistrant.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const UpdateRegistrant = ({ open, onClose, selectedRow, onSave }) => {
  const [formValues, setFormValues] = useState({});

  // Populate form with selected row data on open
  useEffect(() => {
    if (selectedRow) {
      setFormValues(selectedRow);
    }
  }, [selectedRow]);

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };

  // Save handler
  const handleSave = () => {
    onSave(formValues);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Registrant</DialogTitle>
      <DialogContent>
        {selectedRow && (
          <>
            {/* Personal Information */}
            <TextField
              margin="dense"
              label="First Name"
              fullWidth
              value={formValues.firstName || ""}
              onChange={(e) => handleFieldChange("firstName", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Middle Name"
              fullWidth
              value={formValues.middleName || ""}
              onChange={(e) => handleFieldChange("middleName", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Last Name"
              fullWidth
              value={formValues.lastName || ""}
              onChange={(e) => handleFieldChange("lastName", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Extension"
              fullWidth
              value={formValues.extension || ""}
              onChange={(e) => handleFieldChange("extension", e.target.value)}
            />

            {/* Mailing Address */}
            <TextField
              margin="dense"
              label="Mailing Street"
              fullWidth
              value={formValues.mailingStreet || ""}
              onChange={(e) =>
                handleFieldChange("mailingStreet", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Mailing Barangay"
              fullWidth
              value={formValues.mailingBarangay || ""}
              onChange={(e) =>
                handleFieldChange("mailingBarangay", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Mailing District"
              fullWidth
              value={formValues.mailingDistrict || ""}
              onChange={(e) =>
                handleFieldChange("mailingDistrict", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Mailing City"
              fullWidth
              value={formValues.mailingCity || ""}
              onChange={(e) => handleFieldChange("mailingCity", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Mailing Province"
              fullWidth
              value={formValues.mailingProvince || ""}
              onChange={(e) =>
                handleFieldChange("mailingProvince", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Mailing Region"
              fullWidth
              value={formValues.mailingRegion || ""}
              onChange={(e) =>
                handleFieldChange("mailingRegion", e.target.value)
              }
            />

            {/* Contact Information */}
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={formValues.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Mobile Number"
              fullWidth
              value={formValues.mobileNumber || ""}
              onChange={(e) =>
                handleFieldChange("mobileNumber", e.target.value)
              }
            />

            {/* Other Information */}
            <TextField
              margin="dense"
              label="Sex"
              fullWidth
              value={formValues.sex || ""}
              onChange={(e) => handleFieldChange("sex", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Civil Status"
              fullWidth
              value={formValues.civilStatus || ""}
              onChange={(e) => handleFieldChange("civilStatus", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Nationality"
              fullWidth
              value={formValues.nationality || ""}
              onChange={(e) => handleFieldChange("nationality", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Client Classification"
              fullWidth
              value={formValues.clientClassification || ""}
              onChange={(e) =>
                handleFieldChange("clientClassification", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Scholar Type"
              fullWidth
              value={formValues.scholarType || ""}
              onChange={(e) => handleFieldChange("scholarType", e.target.value)}
            />

            {/* Parent Information */}
            <TextField
              margin="dense"
              label="Parent First Name"
              fullWidth
              value={formValues.parentFirstName || ""}
              onChange={(e) =>
                handleFieldChange("parentFirstName", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Parent Middle Name"
              fullWidth
              value={formValues.parentMiddleName || ""}
              onChange={(e) =>
                handleFieldChange("parentMiddleName", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Parent Last Name"
              fullWidth
              value={formValues.parentLastName || ""}
              onChange={(e) =>
                handleFieldChange("parentLastName", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Parent Mailing Street"
              fullWidth
              value={formValues.parentMailingStreet || ""}
              onChange={(e) =>
                handleFieldChange("parentMailingStreet", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Parent Mailing Barangay"
              fullWidth
              value={formValues.parentMailingBarangay || ""}
              onChange={(e) =>
                handleFieldChange("parentMailingBarangay", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Parent Mailing District"
              fullWidth
              value={formValues.parentMailingDistrict || ""}
              onChange={(e) =>
                handleFieldChange("parentMailingDistrict", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Parent Mailing City"
              fullWidth
              value={formValues.parentMailingCity || ""}
              onChange={(e) =>
                handleFieldChange("parentMailingCity", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Parent Mailing Province"
              fullWidth
              value={formValues.parentMailingProvince || ""}
              onChange={(e) =>
                handleFieldChange("parentMailingProvince", e.target.value)
              }
            />
            <TextField
              margin="dense"
              label="Parent Mailing Region"
              fullWidth
              value={formValues.parentMailingRegion || ""}
              onChange={(e) =>
                handleFieldChange("parentMailingRegion", e.target.value)
              }
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateRegistrant;
