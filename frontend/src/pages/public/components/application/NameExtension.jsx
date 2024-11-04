import React, { useState } from "react";
import { Grid, TextField, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Controller } from "react-hook-form";

const DynamicSelectInput = ({
  name, // field name for react-hook-form
  control,
  errors,
  options, // array of options for select
  label, // label for the field
  gridProps = { xs: 12, sm: 6 }, // customizable grid props
  required = false,
  // optional value/label keys if options is array of objects
  valueKey = null,
  labelKey = null,
}) => {
  const [isCustom, setIsCustom] = useState(false);

  // Handle different option formats (simple array vs array of objects)
  const renderMenuItem = (option) => {
    const value = valueKey ? option[valueKey] : option;
    const label = labelKey ? option[labelKey] : option;

    return (
      <MenuItem key={value} value={value}>
        {label}
      </MenuItem>
    );
  };

  return (
    <Grid item {...gridProps}>
      <div className="relative">
        <Controller
          name={name}
          control={control}
          rules={{ required: required ? `${label} is required` : false }}
          render={({ field }) => (
            <>
              {isCustom ? (
                <TextField
                  {...field}
                  fullWidth
                  label={label}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  required={required}
                  InputProps={{
                    endAdornment: (
                      <ArrowDropDownIcon
                        className="cursor-pointer"
                        onClick={() => setIsCustom(false)}
                      />
                    ),
                  }}
                />
              ) : (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label={label}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  required={required}
                  InputProps={{
                    endAdornment: (
                      <EditIcon
                        className="cursor-pointer mr-8"
                        fontSize="small"
                        onClick={() => setIsCustom(true)}
                      />
                    ),
                  }}
                >
                  {options.map(renderMenuItem)}
                </TextField>
              )}
            </>
          )}
        />
      </div>
    </Grid>
  );
};

export default DynamicSelectInput;
