import { Box } from "@mui/material";
import React from "react";

const Profile = () => {
  return (
    <Box>
      <TextField
        {...register("name.firstName")}
        label="First Name"
        helperText={errors.name?.firstName?.message}
        error={Boolean(errors.name?.firstName)}
        fullWidth
      />

      <TextField
        {...register("name.middleName")}
        label="Middle Name"
        helperText={errors.name?.middleName?.message}
        error={Boolean(errors.name?.middleName)}
        fullWidth
      />

      <TextField
        {...register("name.lastName")}
        label="Last Name"
        helperText={errors.name?.lastName?.message}
        error={Boolean(errors.name?.lastName)}
        fullWidth
      />

      <TextField
        {...register("completeMailingAddress.street")}
        label="Street"
        helperText={errors.completeMailingAddress?.street?.message}
        error={Boolean(errors.completeMailingAddress?.street)}
        fullWidth
      />

      <TextField
        {...register("completeMailingAddress.barangay")}
        label="Barangay"
        helperText={errors.completeMailingAddress?.barangay?.message}
        error={Boolean(errors.completeMailingAddress?.barangay)}
        fullWidth
      />

      <TextField
        {...register("completeMailingAddress.district")}
        label="District"
        helperText={errors.completeMailingAddress?.district?.message}
        error={Boolean(errors.completeMailingAddress?.district)}
        fullWidth
      />

      <TextField
        {...register("completeMailingAddress.city")}
        label="City"
        helperText={errors.completeMailingAddress?.city?.message}
        error={Boolean(errors.completeMailingAddress?.city)}
        fullWidth
      />

      <TextField
        {...register("completeMailingAddress.province")}
        label="Province"
        helperText={errors.completeMailingAddress?.province?.message}
        error={Boolean(errors.completeMailingAddress?.province)}
        fullWidth
      />

      <TextField
        {...register("completeMailingAddress.region")}
        label="Region"
        helperText={errors.completeMailingAddress?.region?.message}
        error={Boolean(errors.completeMailingAddress?.region)}
        fullWidth
      />

      <TextField
        {...register("contact.email")}
        label="Email"
        helperText={errors.contact?.email?.message}
        error={Boolean(errors.contact?.email)}
        fullWidth
      />

      <TextField
        {...register("contact.mobileNumber")}
        label="Mobile Number"
        helperText={errors.contact?.mobileNumber?.message}
        error={Boolean(errors.contact?.mobileNumber)}
        fullWidth
      />

      <TextField
        {...register("nationality")}
        label="Nationality"
        helperText={errors.nationality?.message}
        error={Boolean(errors.nationality)}
        fullWidth
      />
    </Box>
  );
};

export default Profile;
