import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { loadModel } from "./palm2";

async function run(questionInput: string) {
  /**
   * This example uses Chinook database, which is a sample database available for SQL Server, Oracle, MySQL, etc.
   * To set it up follow the instructions on https://database.guide/2-sample-databases-sqlite/, placing the .db file
   * in the examples folder.
   */
  const datasource = new DataSource({
    type: "sqlite",
    database: "assets/chinook.db",
  });

  //   const datasource = new DataSource({
  //     type: "postgres",
  //     host: "localhost",
  //     port: 5432,
  //     username: "postgres",
  //     password: "postgres",
  //     database: "chinook",
  //   });

  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });

  const llm = await loadModel();

  /**
   * Create the first prompt template used for getting the SQL query.
   */
  const prompt =
    PromptTemplate.fromTemplate(`Based on the provided SQL table schema below, write a SQL query that would answer the user's question.
------------
SCHEMA: {schema}
------------
QUESTION: {question}
------------
SQL QUERY:`);

  const sqlQueryChain = RunnableSequence.from([
    {
      schema: async () => db.getTableInfo(),
      question: (input: { question: string }) => input.question,
    },
    prompt,
    llm.bind({ stop: ["\nSQLResult:"] }),
    new StringOutputParser(),
  ]);

  const res = await sqlQueryChain.invoke({
    question: questionInput,
  });
  console.log({ res });

  /**
   * Create the final prompt template which is tasked with getting the natural language response.
   */
  const finalResponsePrompt =
    PromptTemplate.fromTemplate(`Based on the table schema below, question, SQL query, and SQL response, write a natural language response:
------------
SCHEMA: {schema}
------------
QUESTION: {question}
------------
SQL QUERY: {query}
------------
SQL RESPONSE: {response}
------------
NATURAL LANGUAGE RESPONSE:`);

  const finalChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      query: sqlQueryChain,
    },
    {
      schema: async () => db.getTableInfo(),
      question: (input) => input.question,
      query: (input) => input.query,
      response: (input) => db.run(input.query),
    },
    finalResponsePrompt,
    llm,
    new StringOutputParser(),
  ]);

  const finalResponse = await finalChain.invoke({
    question: questionInput,
  });

  console.log({ finalResponse });

  /**
   * { finalResponse: 'There are 8 employees.' }
   */
}

const questionInput = process.argv[3];

run(questionInput);

// "How many employees are there?"
