let expenses = [];
let totalAmount = 0;
let editingIndex = null;

const categorySelect = document.getElementById("category_select");
const amountInput = document.getElementById("amount_input");
const infoInput = document.getElementById("info");
const dateInput = document.getElementById("date_input");
const addBtn = document.getElementById("add_btn");
const expenseTableBody = document.getElementById("expense-table-body");
const totalAmountCell = document.getElementById("total-amount");
const entryIdInput = document.getElementById("entry_id");
const themeToggle = document.getElementById('themeToggle');

// Initialize Chart with Labels
let chartData = {
    labels: ['Income', 'Expense'],
    datasets: [{
        data: [0, 0],
        backgroundColor: ['#2ecc71', '#e74c3c'],
    }]
};

let expenseChart = new Chart(document.getElementById('expenseChart'), {
    type: 'pie',
    data: chartData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold'
                },
                formatter: (value, context) => {
                    let label = context.chart.data.labels[context.dataIndex];
                    return `${label}: ${value}`;
                }
            }
        },
    },
});

function updateChart() {
    const income = expenses.reduce((sum, expense) => expense.category === "Income" ? sum + expense.amount : sum, 0);
    const expense = expenses.reduce((sum, expense) => expense.category === "Expense" ? sum + expense.amount : sum, 0);
    chartData.datasets[0].data = [income, expense];
    expenseChart.update();
}

// GSAP animation for form elements focus
document.querySelectorAll("input, select").forEach((element) => {
  element.addEventListener("focus", function () {
    gsap.to(element, { scale: 1.05, duration: 0.3 });
  });
  element.addEventListener("blur", function () {
    gsap.to(element, { scale: 1, duration: 0.3 });
  });
});

addBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission

  const category = categorySelect.value;
  const amount = Number(amountInput.value);
  const info = infoInput.value;
  const date = formatDate(dateInput.value);
  const id = entryIdInput.value;

  // Validation checks
  if (!category) {
    alert("Please select a category");
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  if (!info) {
    alert("Please enter valid info");
    return;
  }
  if (!dateInput.value) {
    alert("Please select a date");
    return;
  }

  const expense = { category, amount, info, date, id };

  if (editingIndex !== null) {
    // Update existing entry
    expenses[editingIndex] = expense;
    editingIndex = null;
    entryIdInput.value = ""; // Clear hidden input
  } else {
    // Add new entry
    expenses.push(expense);
  }

  // Update the total amount
  if (category === "Income") {
    totalAmount += amount;
  } else if (category === "Expense") {
    totalAmount -= amount;
  }
  totalAmountCell.textContent = totalAmount;

  // Update table and chart
  updateTable();
  updateChart();

  // Animate form submission
  gsap.fromTo(".input-section", { scale: 1.05 }, { scale: 1, duration: 0.5 });
  resetForm();
});

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-US", options).toUpperCase();
}

function formatDateToInput(dateString) {
  const [month, day, year] = dateString.split(" ");
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  return `${year}-${months[month]}-${day}`;
}

function updateTable() {
  expenseTableBody.innerHTML = "";
  expenses.forEach((expense, index) => {
    const newRow = expenseTableBody.insertRow();
    newRow.insertCell().textContent = expense.category;
    newRow.insertCell().textContent = expense.amount;
    newRow.insertCell().textContent = expense.info;
    newRow.insertCell().textContent = expense.date;

    const editCell = newRow.insertCell();
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", function () {
      categorySelect.value = expense.category;
      amountInput.value = expense.amount;
      infoInput.value = expense.info;
      dateInput.value = formatDateToInput(expense.date);
      entryIdInput.value = expense.id;
      editingIndex = index;

      if (expense.category === "Income") {
        totalAmount -= expense.amount;
      } else if (expense.category === "Expense") {
        totalAmount += expense.amount;
      }
      totalAmountCell.textContent = totalAmount;
    });
    editCell.appendChild(editBtn);

    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
      expenses.splice(index, 1);
      if (expense.category === "Income") {
        totalAmount -= expense.amount;
      } else if (expense.category === "Expense") {
        totalAmount += expense.amount;
      }
      totalAmountCell.textContent = totalAmount;
      updateTable();
      updateChart();
    });
    deleteCell.appendChild(deleteBtn);

    // GSAP animation for table rows
    gsap.fromTo(
      newRow,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
  });

  updateChart();
}

function resetForm() {
  categorySelect.value = "";
  amountInput.value = "";
  infoInput.value = "";
  dateInput.value = "";
  entryIdInput.value = "";
  editingIndex = null;

  // GSAP animation for form reset
  gsap.fromTo(
    ".input-section",
    { opacity: 0.8 },
    { opacity: 1, duration: 0.5 }
  );
}

// Theme Toggle
themeToggle.addEventListener('change', function () {
  document.body.classList.toggle('dark-mode');
});

updateTable();
