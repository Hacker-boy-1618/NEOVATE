// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';

    // --- Element Selectors ---
    const expenseForm = document.getElementById('expense-form');
    const expensesList = document.getElementById('expenses-list');
    const savingsList = document.getElementById('savings-list');

    // --- Functions to Fetch Data ---

    // Fetches all expenses from the backend and displays them
    const fetchExpenses = async () => {
        try {
            const response = await fetch(`${API_URL}/expenses`);
            if (!response.ok) throw new Error('Failed to fetch expenses');
            const expenses = await response.json();
            displayExpenses(expenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    // Fetches all savings goals and displays them
    const fetchSavingsGoals = async () => {
        try {
            const response = await fetch(`${API_URL}/savings`);
            if (!response.ok) throw new Error('Failed to fetch savings goals');
            const savings = await response.json();
            displaySavingsGoals(savings);
        } catch (error) {
            console.error('Error fetching savings goals:', error);
        }
    };

    // --- Functions to Display Data ---

    // Renders the list of expenses on the page
    const displayExpenses = (expenses) => {
        expensesList.innerHTML = ''; // Clear the list first
        if (expenses.length === 0) {
            expensesList.innerHTML = '<li>No expenses recorded yet.</li>';
            return;
        }
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="description">${expense.description}</span>
                ${expense.category ? `<span class="category">${expense.category}</span>` : ''}
                <span class="amount">-$${parseFloat(expense.amount).toFixed(2)}</span>
            `;
            expensesList.appendChild(li);
        });
    };

    // Renders the list of savings goals on the page
    const displaySavingsGoals = (savings) => {
        savingsList.innerHTML = ''; // Clear the list
        savings.forEach(goal => {
            const li = document.createElement('li');
            const progress = (goal.current_amount / goal.target_amount) * 100;
            li.innerHTML = `
                <span>${goal.goal_name}</span>
                <span class="amount">$${parseFloat(goal.current_amount).toFixed(2)} / $${parseFloat(goal.target_amount).toFixed(2)}</span>
                <!-- You could add a progress bar here! -->
            `;
            savingsList.appendChild(li);
        });
    };

    // --- Event Listeners ---

    // Handles the submission of the new expense form
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        const description = document.getElementById('expense-description').value;
        const amount = document.getElementById('expense-amount').value;
        const category = document.getElementById('expense-category').value;

        try {
            const response = await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description, amount, category }),
            });

            if (!response.ok) throw new Error('Failed to add expense');

            // Refresh the expenses list to show the new one
            fetchExpenses();
            // Clear the form fields
            expenseForm.reset();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    });


    // --- Initial Data Load ---
    // Fetch initial data when the page loads
    fetchExpenses();
    fetchSavingsGoals();
});
