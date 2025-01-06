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
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { qaStore } from "../stores/qa.store";

export const QuestionAnswer = observer(() => {
  const [question, setQuestion] = useState("");
  const { processingStatus, currentAnswer } = qaStore;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (question) {
      await qaStore.askQuestion(question);
      setQuestion("");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ask a Question
      </Typography>

      {processingStatus.status === "error" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {processingStatus.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Enter your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={processingStatus.status === "processing"}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={!question || processingStatus.status === "processing"}
          endIcon={
            processingStatus.status === "processing" ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )
          }
          fullWidth
        >
          Ask Question
        </Button>
      </Box>

      {currentAnswer && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Answer:
          </Typography>
          <Typography variant="body1" paragraph>
            {currentAnswer.answer}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Relevant Sources:
          </Typography>
          {currentAnswer.relevantChunks.map((chunk, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography color="textSecondary">
                    Source: {chunk.source}
                  </Typography>
                  <Chip
                    label={`Confidence: ${(chunk.confidence * 100).toFixed(
                      0
                    )}%`}
                    color={chunk.confidence > 0.7 ? "success" : "warning"}
                    size="small"
                  />
                </Box>
                <Typography variant="body2">{chunk.text}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Paper>
  );
});
