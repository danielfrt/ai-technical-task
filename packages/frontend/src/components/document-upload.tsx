import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { qaStore } from "../stores/qa.store";

export const DocumentUpload = observer(() => {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const { processingStatus } = qaStore;

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await qaStore.uploadDocument(file);
    }
  };

  const handleTextSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (text && source) {
      await qaStore.uploadText(text, source);
      setText("");
      setSource("");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Document or Enter Text
      </Typography>

      {processingStatus.status === "error" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {processingStatus.message}
        </Alert>
      )}

      {processingStatus.status === "success" && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {processingStatus.message}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <input
          accept=".txt,.pdf"
          style={{ display: "none" }}
          id="file-upload"
          type="file"
          onChange={handleFileUpload}
          disabled={processingStatus.status === "processing"}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            disabled={processingStatus.status === "processing"}
            fullWidth
          >
            Upload File
          </Button>
        </label>
      </Box>

      <Typography variant="body1" gutterBottom>
        Or enter text directly:
      </Typography>

      <Box component="form" onSubmit={handleTextSubmit}>
        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={processingStatus.status === "processing"}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          placeholder="Enter source name..."
          value={source}
          onChange={(e) => setSource(e.target.value)}
          disabled={processingStatus.status === "processing"}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={
            !text || !source || processingStatus.status === "processing"
          }
          fullWidth
        >
          {processingStatus.status === "processing" ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Process Text"
          )}
        </Button>
      </Box>
    </Paper>
  );
});
