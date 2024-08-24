from flask import Flask, request, jsonify, render_template
import pandas as pd

app = Flask(__name__)

# Load the data file
final_report = pd.read_csv('final_report.csv')

def financial_chatbot(company, year, query):
    query_map = {
        "what is the total revenue?": 'Total Revenue',
        "what is the net income?": 'Net Income',
        "what is the sum of total assets?": 'Total Assets',
        "what is the sum of total liabilities?": 'Total Liabilities',
        "what is cash flow from operating activities?": 'Cash Flow from Operating Activities',
        "what is the revenue growth(%) ?": 'Revenue Growth (%)',
        "what is the net income growth(%) ?": 'Net Income Growth (%)',
        "what is the assets growth(%) ?": 'Assets Growth (%)',
        "what is the liabilities growth(%) ?": 'Liabilities Growth (%)',
        "what is the cash flow from operations growth(%) ?": 'Cash Flow from Operations Growth(%)',
    }

    query = query.lower()

    if query not in query_map:
        return "Sorry, I cannot provide information on the requested query."

    column = query_map[query]

    year = int(year)
    company_data = final_report[(final_report['Year'] == year) & (final_report['Company'] == company)]
    
    if not company_data.empty and column in company_data.columns:
        value = company_data[column].values[0]
    else:
        value = "N/A"

    return f"The {column.replace('(', ' ').replace(')', '')} for {company} for fiscal year {year} is {value}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    company = data.get('company')
    year = data.get('year')
    query = data.get('query')
    ask_more = data.get('ask_more', False)
    
    if ask_more:
        # Provide options for the user to select a company
        companies = ['Microsoft', 'Apple', 'Tesla']
        return jsonify({'response': "Would you like to ask about another company? Please choose from the following: Microsoft, Apple, Tesla."})

    response = financial_chatbot(company, year, query.lower())
    
    return jsonify({'response': response, 'ask_more': True})

if __name__ == '__main__':
    app.run(debug=True)
