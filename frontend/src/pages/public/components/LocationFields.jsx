import React, { useState } from "react";
import { TextField, MenuItem, InputAdornment, IconButton } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import {
  employmentTypes,
  employmentStatuses,
  educationalAttainments,
  civilStatues,
  clientClassifications,
  municipalities,
  regions,
  provinces,
  locationData,
} from "../../../components/utils/enums/registrant.enums";

const LocationFields = ({
  control,
  setValue,
  watch,
  errors,
  prefix,
  locationData,
}) => {
  const [customFields, setCustomFields] = useState({
    region: false,
    province: false,
    city: false,
  });

  const currentRegion = watch(`${prefix}.region`);
  const currentProvince = watch(`${prefix}.province`);

  const handleLocationChange = (field, value, customValue = false) => {
    // Update custom field state
    setCustomFields((prev) => ({
      ...prev,
      [field]: customValue,
    }));

    // Set the field value
    setValue(`${prefix}.${field}`, customValue ? "" : value);

    // Clear dependent fields
    if (field === "region") {
      setValue(`${prefix}.province`, "");
      setValue(`${prefix}.city`, "");
    } else if (field === "province") {
      setValue(`${prefix}.city`, "");
    }
  };

  const handleCustomReset = (field) => {
    setCustomFields((prev) => ({
      ...prev,
      [field]: false,
    }));
    setValue(`${prefix}.${field}`, "");

    // Clear dependent fields
    if (field === "region") {
      setValue(`${prefix}.province`, "");
      setValue(`${prefix}.city`, "");
    } else if (field === "province") {
      setValue(`${prefix}.city`, "");
    }
  };

  const getHelperText = (field) => {
    const error = errors[prefix]?.[field]?.message;
    if (error) return error;

    if (field === "province") {
      if (!currentRegion) return "Please select a region first";
      if (currentRegion !== "Central Luzon (Region III)") {
        return "Province selection is only available for Region III";
      }
    }

    if (field === "city") {
      if (!currentRegion || !currentProvince)
        return "Please select region and province first";
      if (currentRegion !== "Central Luzon (Region III)") {
        return "City selection is only available for Region III";
      }
    }

    return "";
  };

  const isFieldDisabled = (field) => {
    if (field === "province") return !currentRegion;
    if (field === "city") return !currentRegion || !currentProvince;
    return false;
  };

  const getFieldOptions = (field) => {
    switch (field) {
      case "region":
        return [regions];
      case "province":
        return currentRegion === "Central Luzon (Region III)"
          ? Object.keys(locationData["Central Luzon (Region III)"])
          : [];
      case "city":
        return currentRegion === "Central Luzon (Region III)" && currentProvince
          ? locationData["Central Luzon (Region III)"][currentProvince] || []
          : [];
      default:
        return [];
    }
  };

  const renderField = (field, label) => {
    const isCustom = customFields[field];
    const disabled = isFieldDisabled(field);

    if (isCustom) {
      return (
        <TextField
          fullWidth
          label={`Custom ${label}`}
          placeholder={`Enter ${label.toLowerCase()}`}
          disabled={disabled}
          value={watch(`${prefix}.${field}`) || ""}
          onChange={(e) => setValue(`${prefix}.${field}`, e.target.value)}
          error={!!errors[prefix]?.[field]}
          helperText={getHelperText(field)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleCustomReset(field)}>
                  <ArrowLeft />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      );
    }

    return (
      <TextField
        select
        fullWidth
        label={label}
        disabled={disabled}
        value={watch(`${prefix}.${field}`) || ""}
        onChange={(e) =>
          handleLocationChange(
            field,
            e.target.value,
            e.target.value === "custom"
          )
        }
        error={!!errors[prefix]?.[field]}
        helperText={getHelperText(field)}
      >
        {[...getFieldOptions(field), "Custom"].map((option) => (
          <MenuItem
            key={option}
            value={option === "Custom" ? "custom" : option}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  return (
    <>
      {renderField("region", "Region")}
      {renderField("province", "Province")}
      {renderField("city", "Municipality/City")}
    </>
  );
};

export default LocationFields;
