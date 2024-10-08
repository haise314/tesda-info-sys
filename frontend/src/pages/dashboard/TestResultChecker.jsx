import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { Label } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Input } from "@mui/material";

export default function TestResultChecker() {
  const [uli, setUli] = useState("");
  const [testId, setTestId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uli && testId) {
      navigate(`/api/results/${uli}/${testId}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <ClipboardCheck className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Check Test Results</h2>
          <p className="text-muted-foreground">
            Enter your ULI and Test ID to view your results
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uli">User Learning ID (ULI)</Label>
              <Input
                id="uli"
                type="text"
                placeholder="Enter your ULI"
                value={uli}
                onChange={(e) => setUli(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testId">Test ID</Label>
              <Input
                id="testId"
                type="text"
                placeholder="Enter Test ID"
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              View Results
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
