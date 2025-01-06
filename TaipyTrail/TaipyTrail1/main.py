import taipy as tp
import taipy.gui.builder as tgb
from taipy import Config
import pandas as pd
import datetime

# Sample data
company_data = pd.DataFrame({
    "Symbol": ["AAPL", "GOOGL", "MSFT", "SHOP", "TD", "BMO", "HSBC", "BARC"],
    "Shortname": [
        "Apple", "Google", "Microsoft", "Shopify", "Toronto-Dominion",
        "Bank of Montreal", "HSBC", "Barclays"
    ],
    "Country": ["USA", "USA", "USA", "Canada", "Canada", "Canada", "UK", "UK"]
})

dates = [
    datetime.date(2023, 1, 1),
    datetime.date(2024, 12, 31)
]

# Initial states
country = "USA"  # Default selected country
company = "AAPL"  # Default selected company

# Filter company names based on the selected country
company_names = company_data[["Symbol", "Shortname"]][
    company_data["Country"] == country
].sort_values("Shortname").values.tolist()

# Placeholder prediction values
lin_pred, knn_pred, rnn_pred = 150, 152, 149

# Define the UI layout
with tgb.Page() as page:
    # Page header
    tgb.text("# S&P 500 Stock Value Exploration", mode="md", class_name="text-center")

    # Date range selector (for future use)
    tgb.date_range("{dates}", label_start="Start Date", label_end="End Date")

    # Country and Company selectors
    with tgb.layout(columns="1 3"):
        # Country selector
        tgb.selector(
            label="Country",
            value="{country}",
            lov=[("USA", "USA"), ("Canada", "Canada"), ("UK", "UK")],
            dropdown=True,
            value_by_id=True
        )
        # Company selector
        tgb.selector(
            label="Company",
            value="{company}",
            lov="{company_names}",
            dropdown=True,
            value_by_id=True
        )

    # Predictions display
    with tgb.layout(columns="1 1 1"):
        tgb.text("Linear Prediction: {lin_pred}", class_name="metric-box")
        tgb.text("KNN Prediction: {knn_pred}", class_name="metric-box")
        tgb.text("RNN Prediction: {rnn_pred}", class_name="metric-box")


# Define the filtering function
def filter_company_names(country):
    """
    Filter companies by their country of origin.
    """
    return company_data[["Symbol", "Shortname"]][
        company_data["Country"] == country
    ].sort_values("Shortname").values.tolist()


# Data Nodes for country and company names
country_cfg = Config.configure_data_node(id="country", default_data=country)
company_names_cfg = Config.configure_data_node(id="company_names", default_data=company_names)

# Task for filtering companies
filter_companies_task_cfg = Config.configure_task(
    id="filter_companies_task",
    input=country_cfg,
    output=company_names_cfg,
    function=filter_company_names
)

# Scenario configuration
scenario_cfg = Config.configure_scenario(
    id="country_company_scenario",
    task_configs=[filter_companies_task_cfg]
)

# Callbacks
def on_change(state, name, value):
    if name == "country":
        print(f"{name} was modified to {value}")
        # Update the country data node in the scenario
        state.scenario.country.write(value)
        # Submit the scenario to execute the task
        state.scenario.submit(wait=True)
        # Read the updated company names and update the state
        state.company_names = state.scenario.company_names.read()
    if name == "company":
        print(f"{name} was modified to {value}")

if __name__ == "__main__":
    # Run the orchestrator
    tp.Orchestrator().run()

    # Initialize scenario
    scenario = tp.create_scenario(scenario_cfg)
    # Write the default country to the scenario
    scenario.country.write(country)

    # Run the GUI
    gui = tp.Gui(page)
    gui.run(title="S&P 500 Stock Explorer")
