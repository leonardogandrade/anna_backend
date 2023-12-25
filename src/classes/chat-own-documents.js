const path = require('path')
const { loadModel } = require('./palm2');
const { vectorFilesExists } = require('../utils/os-operations');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { JSONLoader } = require("langchain/document_loaders/fs/json");

const { GooglePaLMEmbeddings } = require("langchain/embeddings/googlepalm");
const { RetrievalQAChain, loadQARefineChain } = require("langchain/chains");
const { HNSWLib } = require("langchain/vectorstores/hnswlib");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const DOCUMENTS_PATH = path.join(__dirname, '..', '..', 'uploads', 'documents')
const VECTOR_STORE_PATH = path.join(__dirname, '..', '..', 'uploads', 'documents')

// Load files
const loader = new DirectoryLoader(DOCUMENTS_PATH, {
    ".json": (path) => new JSONLoader(path),
    ".txt": (path) => new TextLoader(path)
})

// Normalize the files content
const normalizeDocuments = async (docs) => {
    return docs.map((doc) => {
        if (typeof doc.pageContent === "string") {
            return doc.pageContent;
        } else if (Array.isArray(doc.pageContent)) {
            return doc.pageContent.join("\n");
        }
    });
}

const createVectors = async () => {
    let vectorStore;

    console.log('loading files...')
    const docs = await loader.load()

    console.log('Creating new vector store...')
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
    });

    // // Normalize data
    const normalizedDocs = await normalizeDocuments(docs);
    const splitDocs = await textSplitter.createDocuments(normalizedDocs);

    console.log(splitDocs)

    // // Generate the vector store from the documents
    console.log("creating vector storing.")

    vectorStore = await HNSWLib.fromDocuments(
        splitDocs,
        new GooglePaLMEmbeddings()
    );

    await vectorStore.save(VECTOR_STORE_PATH);

}

async function askOwnDocuments(question) {
    try {
        let vectorStore;

        // Load model
        const model = await loadModel()

        // If vectors was created, just read then, otherwise create ans save on disk
        if (vectorFilesExists() === 0)
            await createVectors()

        vectorStore = await HNSWLib.load(
            VECTOR_STORE_PATH,
            new GooglePaLMEmbeddings()
        );

        console.log("Creating retrieval chain...")

        // // Query the retrieval chain with the specified question
        const chain = new RetrievalQAChain({
            combineDocumentsChain: loadQARefineChain(model),
            retriever: vectorStore.asRetriever(),
        });

        console.log("Querying chain...")
        const res = await chain.call({ query: question })

        return res.output_text
        // return 'resposta'

    } catch (error) {
        throw new Error(`error while trying to apply model: ${error}`)
    }

}

// askOwnDocuments("is golang supported?")

module.exports = {
    askOwnDocuments,
}
