import os
from typing import List, Dict
from pinecone import Pinecone
from dotenv import load_dotenv
from gensim import corpora, models
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

load_dotenv()

class TopicModeler:
    def __init__(self):
        self.pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
        self.index = self.pc.Index(os.getenv('PINECONE_INDEX_NAME', 'pdf-index'))
        
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
        
    def extract_topics(self, texts: List[str], num_topics: int = 5) -> List[Dict[str, List[str]]]:
        processed_texts = []
        for text in texts:
            tokens = word_tokenize(text.lower())
            tokens = [
                self.lemmatizer.lemmatize(token)
                for token in tokens
                if token.isalnum() and token not in self.stop_words
            ]
            processed_texts.append(tokens)
        
        dictionary = corpora.Dictionary(processed_texts)
        corpus = [dictionary.doc2bow(text) for text in processed_texts]
        
        lda_model = models.LdaModel(
            corpus=corpus,
            id2word=dictionary,
            num_topics=num_topics,
            passes=15
        )
        
        document_topics = []
        for doc_bow in corpus:
            topics = lda_model.get_document_topics(doc_bow)
            topic_words = []
            for topic_id, prob in topics:
                words = [word for word, _ in lda_model.show_topic(topic_id, topn=3)]
                topic_words.extend(words)
            document_topics.append({
                'topics': list(set(topic_words))
            })
        
        return document_topics
    
    def update_topics_in_pinecone(self):
        try:
            stats = self.index.describe_index_stats()
            total_vectors = stats.total_vector_count
            
            if total_vectors == 0:
                print("No documents found in index")
                return
            
            query_response = self.index.query(
                vector=[0] * 100,
                top_k=total_vectors,
                include_metadata=True
            )
            
            chunk_ids = []
            texts = []
            
            for vector in query_response.matches:
                if 'text' in vector.metadata:
                    chunk_ids.append(vector.id)
                    texts.append(vector.metadata['text'])
            
            if not texts:
                print("No texts found in vector metadata")
                return
            
            document_topics = self.extract_topics(texts)
            
            for chunk_id, topics in zip(chunk_ids, document_topics):
                try:
                    self.index.update(
                        id=chunk_id,
                        set_metadata={'topics': topics['topics']}
                    )
                    print(f"Updated topics for document {chunk_id}: {topics['topics']}")
                except Exception as e:
                    print(f"Error updating topics for document {chunk_id}: {str(e)}")
            
            print("Topic modeling completed successfully")
            
        except Exception as e:
            print(f"Error during topic modeling: {str(e)}")

if __name__ == "__main__":
    modeler = TopicModeler()
    modeler.update_topics_in_pinecone() 