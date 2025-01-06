import {
  Container,
  Typography,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { DocumentUpload } from "./components/document-upload";
import { QuestionAnswer } from "./components/question-answer";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            AI-Enhanced Document QA System
          </Typography>

          <DocumentUpload />
          <QuestionAnswer />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
