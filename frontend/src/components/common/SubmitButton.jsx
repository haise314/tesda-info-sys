import React, { useState } from "react";
import { Button, CircularProgress } from "@/components/ui/button";

const SubmitButton = ({ isSubmitting, onSubmit }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onSubmit}
      disabled={isSubmitting}
      className="relative"
    >
      {isSubmitting ? (
        <>
          <CircularProgress
            size={24}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <span className="opacity-0">Submit</span>
        </>
      ) : (
        "Submit"
      )}
    </Button>
  );
};

export default function YourFormComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data) => {
    setIsSubmitting(true);
    mutation.mutate(data, {
      onSuccess: (response) => {
        console.log("Server response:", response.data);
        setSnackbar({
          open: true,
          message: "Application submitted successfully!",
          severity: "success",
        });
        reset();
      },
      onError: (error) => {
        console.error("Error submitting form:", error);
        setSnackbar({
          open: true,
          message: `Error submitting application: ${error.message}`,
          severity: "error",
        });
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Your form fields here */}
      <SubmitButton
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
      />
    </form>
  );
}
