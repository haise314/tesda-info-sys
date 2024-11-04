import { Alert } from "@mui/material";
import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const ReCAPTCHAWrapper = ({ onVerify, siteKey }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if reCAPTCHA script is loaded
    const checkRecaptchaLoad = () => {
      if (window.grecaptcha) {
        setIsLoaded(true);
      }
    };

    // Add load event listener
    const script = document.querySelector('script[src*="recaptcha"]');
    if (script) {
      script.addEventListener("load", checkRecaptchaLoad);
    }

    // Initial check
    checkRecaptchaLoad();

    return () => {
      if (script) {
        script.removeEventListener("load", checkRecaptchaLoad);
      }
    };
  }, []);

  const handleChange = (token) => {
    setError(null);
    onVerify(token);
  };

  const handleError = () => {
    setError(
      "reCAPTCHA failed to load. Please check your internet connection and try again."
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {error && (
        <Alert variant="destructive" className="w-full">
          {error}
        </Alert>
      )}

      {!isLoaded && <Alert className="w-full">Loading reCAPTCHA...</Alert>}

      <ReCAPTCHA
        sitekey={siteKey}
        onChange={handleChange}
        onError={handleError}
      />
    </div>
  );
};

export default ReCAPTCHAWrapper;
