<Grid item xs={12} sm={6}>
<Controller
  name="birthdate"
  control={control}
  rules={{
    required: "Birthdate is required",
    validate: (value) => {
      if (dayjs(value).isAfter(dayjs())) {
        return "Birthdate cannot be in the future";
      }
      const age = dayjs().diff(dayjs(value), "year");
      if (age < 16) {
        return "You must be at least 18 years old to register.";
      }
      return true;
    },
  }}
  render={({ field }) => (
    <TextField
      {...field}
      fullWidth
      type="date"
      label="Birthdate"
      InputLabelProps={{ shrink: true }}
      error={!!errors.birthdate}
      helperText={errors.birthdate?.message}
      inputProps={{
        max: dayjs().format("YYYY-MM-DD"),
      }}
    />
  )}
/>
</Grid>
<Grid item xs={12} sm={6}>
<Controller
  name="age"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      fullWidth
      type="number"
      label="Age"
      error={!!errors.age}
      helperText={errors.age?.message}
      InputProps={{
        readOnly: true,
      }}
    />
  )}
/>
</Grid>

<Grid item xs={12} sm={6}>
<Controller
  name="nationality"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      fullWidth
      type="text"
      label="Nationality"
      error={!!errors.nationality}
      helperText={errors.nationality?.message}
    />
  )}
/>
</Grid>
{/* Birthplace Section */}
<Grid item xs={12}>
<Typography variant="h6" gutterBottom>
  Birthplace
</Typography>
</Grid>

<Grid item xs={12} sm={3}>
<Controller
  name="birthplace.region"
  control={control}
  render={({ field: { ref, ...fieldProps } }) => {
    const [isCustom, setIsCustom] = useState(false);

    const handleChange = (event) => {
      const value = event.target.value;
      setIsCustom(value === "custom");
      fieldProps.onChange(value === "custom" ? "" : value);

      // Clear dependent fields
      control.setValue("birthplace.barangay", "");
      control.setValue("birthplace.province", "");
      control.setValue("birthplace.city", "");
    };

    const handleReset = () => {
      setIsCustom(false);
      fieldProps.onChange("");
      control.setValue("birthplace.barangay", "");
      control.setValue("birthplace.province", "");
      control.setValue("birthplace.city", "");
    };

    return isCustom ? (
      <TextField
        {...fieldProps}
        inputRef={ref}
        fullWidth
        label="Custom Region"
        placeholder="Type your region"
        onChange={(e) => fieldProps.onChange(e.target.value)}
        error={!!errors.birthplace?.region}
        helperText={errors.birthplace?.region?.message}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleReset} edge="end">
                <ArrowBackIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    ) : (
      <TextField
        {...fieldProps}
        inputRef={ref}
        select
        fullWidth
        label="Region"
        onChange={handleChange}
        error={!!errors.birthplace?.region}
        helperText={errors.birthplace?.region?.message}
      >
        {[...regions, "Custom"].map((option) => (
          <MenuItem
            key={option}
            value={option === "Custom" ? "custom" : option}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }}
/>
</Grid>

<Grid item xs={12} sm={3}>
<Controller
  name="birthplace.province"
  control={control}
  render={({ field: { ref, ...fieldProps } }) => {
    const [isCustom, setIsCustom] = useState(false);
    const currentRegion = control._formValues.birthplace?.region;

    const handleChange = (event) => {
      const value = event.target.value;
      setIsCustom(value === "custom");
      fieldProps.onChange(value === "custom" ? "" : value);

      // Clear dependent city
      control.setValue("birthplace.city", "");
    };

    const handleReset = () => {
      setIsCustom(false);
      fieldProps.onChange("");
      control.setValue("birthplace.city", "");
    };

    const isDisabled = !currentRegion;
    const getHelperText = () => {
      if (errors.birthplace?.province?.message) {
        return errors.birthplace.province.message;
      }
      if (isDisabled) {
        return "Please select a region first";
      }
      if (currentRegion !== "Central Luzon (Region III)") {
        return "Province selection is only available for Region III";
      }
      return "";
    };

    return isCustom ? (
      <TextField
        {...fieldProps}
        inputRef={ref}
        fullWidth
        disabled={isDisabled}
        label="Custom Province"
        placeholder="Type your province"
        onChange={(e) => fieldProps.onChange(e.target.value)}
        error={!!errors.birthplace?.province}
        helperText={getHelperText()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleReset} edge="end">
                <ArrowBackIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    ) : (
      <TextField
        {...fieldProps}
        inputRef={ref}
        select
        fullWidth
        disabled={isDisabled}
        label="Province"
        onChange={handleChange}
        error={!!errors.birthplace?.province}
        helperText={getHelperText()}
      >
        {[
          ...(currentRegion === "Central Luzon (Region III)"
            ? Object.keys(
                locationData["Central Luzon (Region III)"]
              )
            : []),
          "Custom",
        ].map((option) => (
          <MenuItem
            key={option}
            value={option === "Custom" ? "custom" : option}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }}
/>
</Grid>

<Grid item xs={12} sm={3}>
<Controller
  name="birthplace.city"
  control={control}
  render={({ field: { ref, ...fieldProps } }) => {
    const [isCustom, setIsCustom] = useState(false);
    const currentRegion = control._formValues.birthplace?.region;
    const currentProvince =
      control._formValues.birthplace?.province;

    const handleChange = (event) => {
      const value = event.target.value;
      setIsCustom(value === "custom");
      fieldProps.onChange(value === "custom" ? "" : value);
    };

    const handleReset = () => {
      setIsCustom(false);
      fieldProps.onChange("");
    };

    const isDisabled = !currentRegion || !currentProvince;
    const getHelperText = () => {
      if (errors.birthplace?.city?.message) {
        return errors.birthplace.city.message;
      }
      if (isDisabled) {
        return "Please select a region and province first";
      }
      if (currentRegion !== "Central Luzon (Region III)") {
        return "City selection is only available for Region III";
      }
      return "";
    };

    return isCustom ? (
      <TextField
        {...fieldProps}
        inputRef={ref}
        fullWidth
        disabled={isDisabled}
        label="Custom Municipality/City"
        placeholder="Type your municipality/city"
        onChange={(e) => fieldProps.onChange(e.target.value)}
        error={!!errors.birthplace?.city}
        helperText={getHelperText()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleReset} edge="end">
                <ArrowBackIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    ) : (
      <TextField
        {...fieldProps}
        inputRef={ref}
        select
        fullWidth
        disabled={isDisabled}
        label="Municipality/City"
        onChange={handleChange}
        error={!!errors.birthplace?.city}
        helperText={getHelperText()}
      >
        {[
          ...(currentRegion === "Central Luzon (Region III)" &&
          currentProvince
            ? locationData["Central Luzon (Region III)"][
                currentProvince
              ] || []
            : []),
          "Custom",
        ].map((option) => (
          <MenuItem
            key={option}
            value={option === "Custom" ? "custom" : option}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }}
/>
</Grid>
<Grid item xs={12} sm={3}>
<Controller
  name="birthplace.barangay"
  control={control}
  render={({ field: { ref, ...fieldProps } }) => {
    const [isCustom, setIsCustom] = useState(false);
    const currentRegion = control._formValues.birthplace?.region;
    const currentProvince =
      control._formValues.birthplace?.province;
    const currentCity = control._formValues.birthplace?.city;

    const handleChange = (event) => {
      const value = event.target.value;
      setIsCustom(value === "custom");
      fieldProps.onChange(value === "custom" ? "" : value);
    };

    const handleReset = () => {
      setIsCustom(false);
      fieldProps.onChange("");
    };

    const isDisabled =
      !currentRegion || !currentProvince || !currentCity;

    const getHelperText = () => {
      if (errors.birthplace?.barangay?.message) {
        return errors.birthplace.barangay.message;
      }
      if (isDisabled) {
        return "Please select a region, province, and city first";
      }
      if (currentRegion !== "Central Luzon (Region III)") {
        return "Barangay selection is only available for Region III";
      }
      return "";
    };

    // Get barangay options based on selected city
    const getBarangayOptions = () => {
      if (
        currentRegion === "Central Luzon (Region III)" &&
        currentProvince === "Zambales" &&
        currentCity &&
        Zambales.Zambales[currentCity]
      ) {
        return Zambales.Zambales[currentCity];
      }
      return [];
    };

    return isCustom ? (
      <TextField
        {...fieldProps}
        inputRef={ref}
        fullWidth
        disabled={isDisabled}
        label="Custom Barangay"
        placeholder="Type your barangay"
        onChange={(e) => fieldProps.onChange(e.target.value)}
        error={!!errors.birthplace?.barangay}
        helperText={getHelperText()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleReset} edge="end">
                <ArrowBackIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    ) : (
      <TextField
        {...fieldProps}
        inputRef={ref}
        select
        fullWidth
        disabled={isDisabled}
        label="Barangay"
        onChange={handleChange}
        error={!!errors.birthplace?.barangay}
        helperText={getHelperText()}
      >
        {[...getBarangayOptions(), "Custom"].map((option) => (
          <MenuItem
            key={option}
            value={option === "Custom" ? "custom" : option}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }}
/>
</Grid>
{/* Contact Information Section */}
<Grid item xs={12}>
<Typography variant="h6" gutterBottom>
  Contact Information
</Typography>
</Grid>
<Grid item xs={12} sm={6}>
<Controller
  name="contact.telephoneNumber"
  control={control}
  render={({ field: { ref, ...field } }) => (
    <TextField
      {...field}
      inputRef={ref}
      fullWidth
      label="Telephone Number"
      error={!!errors.contact?.telephoneNumber}
      helperText={errors.contact?.telephoneNumber?.message}
    />
  )}
/>
</Grid>
<Grid item xs={12} sm={6}>
<Controller
  name="contact.mobileNumber"
  control={control}
  render={({ field: { ref, ...field } }) => (
    <TextField
      {...field}
      inputRef={ref}
      fullWidth
      label="Mobile Number"
      error={!!errors.contact?.mobileNumber}
      helperText={errors.contact?.mobileNumber?.message}
    />
  )}
/>
</Grid>
<Grid item xs={12}>
<Controller
  name="contact.email"
  control={control}
  render={({ field: { ref, ...field } }) => (
    <TextField
      {...field}
      inputRef={ref}
      fullWidth
      label="Email"
      type="email"
      error={!!errors.contact?.email}
      helperText={errors.contact?.email?.message}
    />
  )}
/>
</Grid>
<Grid item xs={12} sm={6}>
<Controller
  name="contact.fax"
  control={control}
  render={({ field: { ref, ...field } }) => (
    <TextField
      {...field}
      inputRef={ref}
      fullWidth
      label="Fax"
      error={!!errors.contact?.fax}
      helperText={errors.contact?.fax?.message}
    />
  )}
/>
</Grid>
<Grid item xs={12} sm={6}>
<Controller
  name="contact.others"
  control={control}
  render={({ field: { ref, ...field } }) => (
    <TextField
      {...field}
      inputRef={ref}
      fullWidth
      label="Other Contact"
      error={!!errors.contact?.others}
      helperText={errors.contact?.others?.message}
    />
  )}
/>
</Grid>
{/* Complete Mailing Address Section */}
<Grid item xs={12}>
<Typography variant="h6" gutterBottom>
  Complete Mailing Address
</Typography>
</Grid>
{Object.keys(control._defaultValues.completeMailingAddress).map(
(field) => (
  <Grid item xs={12} sm={4} key={field}>
    <Controller
      name={`completeMailingAddress.${field}`}
      control={control}
      render={({ field: { ref, ...fieldProps } }) => {
        const [isCustom, setIsCustom] = useState(false);

        // Get currently selected values from form
        const currentRegion =
          control._formValues.completeMailingAddress?.region;
        const currentProvince =
          control._formValues.completeMailingAddress?.province;
        const currentCity =
          control._formValues.completeMailingAddress?.city;

        // Updated Zambales zipcode mapping based on the municipalities enum
        const zambalesZipcodes = {
          Botolan: "2202",
          Cabangan: "2203",
          Candelaria: "2212",
          Castillejos: "2208",
          Iba: "2201",
          Masinloc: "2211",
          Olongapo: "2200",
          Palauig: "2210",
          "San Antonio": "2206",
          "San Felipe": "2204",
          "San Marcelino": "2207",
          "San Narciso": "2205",
          "Santa Cruz": "2113",
          Subic: "2209",
        };

        // Automatic district mapping for Zambales
        const zambalesDistrictMapping = {
          District1: [
            "Castillejos",
            "San Marcelino",
            "Olongapo",
            "Subic",
          ],
          District2: [
            "Botolan",
            "Cabangan",
            "Candelaria",
            "Iba",
            "Masinloc",
            "Palauig",
            "San Antonio",
            "San Felipe",
            "San Narciso",
            "Santa Cruz",
          ],
        };

        // Determine the automatic district based on city
        const getAutomaticDistrict = (city) => {
          for (const [district, cities] of Object.entries(
            zambalesDistrictMapping
          )) {
            if (cities.includes(city)) {
              return district.replace("District", "");
            }
          }
          return "";
        };

        // Use useEffect to automatically set zipcode and district for Zambales
        useEffect(() => {
          if (
            currentProvince === "Zambales" &&
            currentCity &&
            zambalesZipcodes[currentCity]
          ) {
            // Set zipcode
            setValue(
              "completeMailingAddress.zipCode",
              zambalesZipcodes[currentCity]
            );

            // Set district
            const autoDistrict =
              getAutomaticDistrict(currentCity);
            if (autoDistrict) {
              setValue(
                "completeMailingAddress.district",
                autoDistrict
              );
            }
          }
        }, [currentCity, currentProvince, setValue]);

        // Use useEffect to automatically set zipcode for other provinces
        useEffect(() => {
          // For non-Zambales provinces, clear the zipcode
          if (currentProvince !== "Zambales") {
            setValue("completeMailingAddress.zipCode", "");
          }
        }, [currentProvince, setValue]);

        // Determine if this field should have custom option
        const hasCustomOption = [
          "province",
          "region",
          "city",
          "barangay",
        ].includes(field);

        // Get the appropriate options list for select fields
        const getOptions = () => {
          switch (field) {
            case "region":
              return regions;
            case "province":
              return currentRegion ===
                "Central Luzon (Region III)"
                ? Object.keys(
                    locationData["Central Luzon (Region III)"]
                  )
                : [];
            case "city":
              if (
                currentRegion === "Central Luzon (Region III)" &&
                currentProvince === "Zambales"
              ) {
                return municipalities;
              }
              return currentRegion ===
                "Central Luzon (Region III)" && currentProvince
                ? locationData["Central Luzon (Region III)"][
                    currentProvince
                  ] || []
                : [];
            case "barangay":
              if (
                currentRegion === "Central Luzon (Region III)" &&
                currentProvince === "Zambales" &&
                currentCity &&
                Zambales.Zambales[currentCity]
              ) {
                return Zambales.Zambales[currentCity];
              }
              return [];
            case "district":
              return ["1", "2"];
            default:
              return [];
          }
        };

        // Handle select change for custom fields
        const handleChange = (event) => {
          const value = event.target.value;
          if (hasCustomOption) {
            setIsCustom(value === "custom");
            fieldProps.onChange(value === "custom" ? "" : value);

            // Clear dependent fields when parent field changes
            if (field === "region") {
              control.setValue(
                "completeMailingAddress.province",
                ""
              );
              control.setValue("completeMailingAddress.city", "");
              control.setValue(
                "completeMailingAddress.barangay",
                ""
              );
              control.setValue(
                "completeMailingAddress.zipCode",
                ""
              );
              control.setValue(
                "completeMailingAddress.district",
                ""
              );
            } else if (field === "province") {
              control.setValue("completeMailingAddress.city", "");
              control.setValue(
                "completeMailingAddress.barangay",
                ""
              );
              control.setValue(
                "completeMailingAddress.zipCode",
                ""
              );
              control.setValue(
                "completeMailingAddress.district",
                ""
              );
            } else if (field === "city") {
              control.setValue(
                "completeMailingAddress.barangay",
                ""
              );

              // Automatically set district for Zambales
              if (
                currentProvince === "Zambales" &&
                value !== "custom"
              ) {
                const autoDistrict = getAutomaticDistrict(value);
                if (autoDistrict) {
                  control.setValue(
                    "completeMailingAddress.district",
                    autoDistrict
                  );
                }

                // Set zipcode if it's a Zambales municipality
                const zipcode = zambalesZipcodes[value];
                if (zipcode) {
                  control.setValue(
                    "completeMailingAddress.zipCode",
                    zipcode
                  );
                } else {
                  control.setValue(
                    "completeMailingAddress.zipCode",
                    ""
                  );
                }
              }
            }
          } else {
            fieldProps.onChange(value);
          }
        };

        // Handle reset for custom input
        const handleReset = () => {
          setIsCustom(false);
          fieldProps.onChange("");

          // Clear dependent fields when resetting
          if (field === "region") {
            control.setValue(
              "completeMailingAddress.province",
              ""
            );
            control.setValue("completeMailingAddress.city", "");
            control.setValue(
              "completeMailingAddress.barangay",
              ""
            );
            control.setValue(
              "completeMailingAddress.zipCode",
              ""
            );
          } else if (field === "province") {
            control.setValue("completeMailingAddress.city", "");
            control.setValue(
              "completeMailingAddress.barangay",
              ""
            );
            control.setValue(
              "completeMailingAddress.zipCode",
              ""
            );
          } else if (field === "city") {
            control.setValue(
              "completeMailingAddress.barangay",
              ""
            );
            control.setValue(
              "completeMailingAddress.zipCode",
              ""
            );
          }
        };

        // Format the label
        const formattedLabel =
          field.charAt(0).toUpperCase() +
          field.slice(1).replace(/([A-Z])/g, " $1");

        // Determine if field should be disabled and get helper text
        const isDisabled =
          (field === "province" && !currentRegion) ||
          (field === "city" &&
            (!currentRegion || !currentProvince)) ||
          (field === "barangay" &&
            (!currentRegion || !currentProvince || !currentCity));

        const getHelperText = () => {
          if (errors.completeMailingAddress?.[field]?.message) {
            return errors.completeMailingAddress[field].message;
          }
          if (isDisabled) {
            if (field === "city")
              return "Please select a province first";
            if (field === "province")
              return "Please select a region first";
            if (field === "barangay")
              return "Please select a city first";
            return "";
          }
          if (
            ["province", "city", "barangay"].includes(field) &&
            currentRegion !== "Central Luzon (Region III)"
          ) {
            return `${formattedLabel} selection is only available for Region III`;
          }
          return "";
        };

        // If it's the zipcode or district field
        if (field === "zipCode" || field === "district") {
          return (
            <TextField
              {...fieldProps}
              inputRef={ref}
              fullWidth
              label={formattedLabel}
              error={!!errors.completeMailingAddress?.[field]}
              helperText={
                errors.completeMailingAddress?.[field]?.message
              }
              InputProps={
                field === "zipCode" || field === "district"
                  ? {
                      readOnly:
                        field === "zipCode"
                          ? currentProvince === "Zambales" &&
                            zambalesZipcodes[currentCity]
                          : false,
                    }
                  : {}
              }
            />
          );
        }

        // If it's a custom-enabled field and in custom mode
        if (hasCustomOption && isCustom) {
          return (
            <TextField
              {...fieldProps}
              inputRef={ref}
              fullWidth
              disabled={isDisabled}
              label={`Custom ${formattedLabel}`}
              placeholder={`Type your ${field}`}
              onChange={(e) =>
                fieldProps.onChange(e.target.value)
              }
              error={!!errors.completeMailingAddress?.[field]}
              helperText={getHelperText()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleReset} edge="end">
                      <ArrowBackIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          );
        }

        // If it's a custom-enabled field but in select mode
        if (hasCustomOption) {
          const options = getOptions();
          return (
            <TextField
              {...fieldProps}
              inputRef={ref}
              select
              fullWidth
              disabled={isDisabled}
              label={formattedLabel}
              onChange={handleChange}
              error={!!errors.completeMailingAddress?.[field]}
              helperText={getHelperText()}
            >
              {[...options, "Custom"].map((option) => (
                <MenuItem
                  key={option}
                  value={option === "Custom" ? "custom" : option}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>
          );
        }

        // Regular text field for other fields
        return (
          <TextField
            {...fieldProps}
            inputRef={ref}
            fullWidth
            label={formattedLabel}
            error={!!errors.completeMailingAddress?.[field]}
            helperText={
              errors.completeMailingAddress?.[field]?.message
            }
          />
        );
      }}
    />
  </Grid>
)
)}
{/* Employment & Education Section */}
<Grid item xs={12}>
<Typography variant="h6" gutterBottom>
  Employment & Education
</Typography>
</Grid>
<Grid item xs={12} sm={6}>
<Controller
  name="employmentStatus"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      select
      fullWidth
      label="Employment Status"
      error={!!errors.employmentStatus}
      helperText={errors.employmentStatus?.message}
    >
      {employmentStatuses.map((status) => (
        <MenuItem key={status} value={status}>
          {status}
        </MenuItem>
      ))}
    </TextField>
  )}
/>
</Grid>
<Grid item xs={12} sm={6}>
<Controller
  name="employmentType"
  control={control}
  defaultValue={null} // Set default value to null instead of empty string
  render={({ field }) => (
    <TextField
      {...field}
      select
      fullWidth
      label="Employment Type"
      disabled={["Unemployed", "Self-Employed"].includes(
        employmentStatus
      )}
      error={!!errors.employmentType}
      helperText={errors.employmentType?.message}
      value={field.value || ""} // Handle null value in display
    >
      {employmentTypes.map((type) => (
        <MenuItem key={type} value={type}>
          {type}
        </MenuItem>
      ))}
    </TextField>
  )}
/>
</Grid>
<Grid item xs={12}>
<Controller
  name="education"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      select
      fullWidth
      label="Educational Attainment"
      error={!!errors.education}
      helperText={errors.education?.message}
    >
      {educationalAttainments.map((edu) => (
        <MenuItem key={edu} value={edu}>
          {edu}
        </MenuItem>
      ))}
    </TextField>
  )}
/>
</Grid>
{/* Family Information Section */}
<Grid item xs={12}>
<Typography variant="h6" gutterBottom>
  Mother's Information
</Typography>
{renderNameFields("motherName")}
</Grid>
<Grid item xs={12} sx={{ mt: 2 }}>
<Typography variant="h6" gutterBottom>
  Father's Information
</Typography>
{renderNameFields("fatherName")}
</Grid>

{/* Client Classification */}
<Grid
item
xs={12}
md={watchClientClassification === "Others" ? 6 : 12}
>
<Controller
  name="clientClassification"
  control={control}
  rules={{ required: "Client classification is required" }}
  render={({ field }) => (
    <FormControl fullWidth error={!!errors.clientClassification}>
      <InputLabel>Client Classification</InputLabel>
      <Select {...field} label="Client Classification">
        {clientClassifications.map((classification) => (
          <MenuItem key={classification} value={classification}>
            {classification}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        {errors.clientClassification?.message}
      </FormHelperText>
    </FormControl>
  )}
/>
</Grid>

{/* Other Client Classification */}
{watchClientClassification === "Others" && (
<Grid item xs={12} md={6}>
  <Controller
    name="otherClientClassification"
    control={control}
    rules={{ required: "Please specify other classification" }}
    render={({ field }) => (
      <TextField
        {...field}
        label="Specify Other Classification"
        fullWidth
        error={!!errors.otherClientClassification}
        helperText={errors.otherClientClassification?.message}
      />
    )}
  />
</Grid>
)}