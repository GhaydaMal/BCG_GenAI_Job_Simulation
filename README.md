# Financial Chatbot

## Overview

The Financial Chatbot is a simple, rule-based chatbot designed to provide financial information about specific companies. It can handle predefined queries about financial metrics and operates through a basic conversational flow. This chatbot is implemented using Flask for the backend and JavaScript for the frontend interaction.

## Features

- **Predefined Queries**: The chatbot can respond to specific financial queries about companies.
- **Company and Year Selection**: Users can inquire about financial data for Microsoft, Apple, or Tesla for the fiscal years 2021, 2022, or 2023.
- **Response Handling**: After each interaction, users are prompted to ask about another company or end the session.

## Project Structure

- `app.py`: The Flask backend handling data retrieval and response generation.
- `final_report.csv`: The CSV file containing the financial data.
- `index.html`: The HTML template for the chatbot interface.
- `styles.css`: The CSS file for styling the chatbot interface.
- `app.js`: The JavaScript file managing the chat interactions.
