# AI-Enhanced Document QA System

A system for document processing and question answering using artificial intelligence.

## Architecture

The project is built as a monorepo with three main components:

1. **Backend** (Node.js/Express):

   - Document processing and storage
   - Question answering API
   - Integration with Pinecone and Claude AI
   - RAG (Retrieval Augmented Generation) implementation

2. **Frontend** (React/MobX):

   - Document upload
   - Question answering interface
   - Results visualization
   - Processing status display

3. **Python Script**:
   - Document topic modeling
   - Pinecone metadata updates

## Installation

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Python >= 3.8
- Git

### Installation Steps

1. Clone the repository:

```bash
git clone [repository-url]
cd ai-technical-task
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file and add your API keys:

- PINECONE_API_KEY
- PINECONE_ENVIRONMENT
- PINECONE_INDEX_NAME
- AI_API_KEY

4. Install Python dependencies:

```bash
cd packages/python-scripts
pip install -r requirements.txt
```

## Running the Application

1. Start the backend:

```bash
cd packages/backend
pnpm dev
```

2. Start the frontend:

```bash
cd packages/frontend
pnpm dev
```

3. Run the topic modeling script (when needed):

```bash
cd packages/python-scripts
python topic_modeling.py
```

## Usage

1. Open http://localhost:5173 in your browser
2. Upload a document (PDF or text file)
3. Wait for processing to complete
4. Ask questions about the document content

## Development Approach

1. **Monorepo**: Using pnpm workspaces for dependency and script management.

2. **Backend**:

   - Express for API
   - TypeScript for type safety
   - Modular architecture with service separation
   - External API integration (Pinecone, Claude)

3. **Frontend**:

   - Vite for fast development
   - MobX for state management
   - Material-UI for components
   - TypeScript for type safety

4. **Python Script**:
   - Gensim for topic modeling
   - NLTK for text processing
   - Pinecone integration for metadata updates

## Challenges and Solutions

1. **Pinecone Integration**:

   - Challenge: New technology for me
   - Solution: Reading the article, information from ChatGPT

2. **Document Processing**:

   - Challenge: Efficient chunking
   - Solution: Implementing an overlap algorithm to improve context

3. **Theme modelling**:
   - Problem: Quality of topic extraction
   - Solution: Using LDA with text preprocessing. reserch with ChatGPT

## Future Improvements

1. Add tests
2. Improve error handling
3. Optimize API usage
4. Enhance UI/UX
