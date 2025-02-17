const form = document.querySelector("form");
const expense = document.querySelector("#expense");
const category = document.querySelector("#category");
const amount = document.querySelector("#amount");

const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside > header > h2");
const expensesQuantity = document.querySelector("aside > header > p > span");

let list = [];
const EXPENSE_ITEM = "expenseList";

document.addEventListener("DOMContentLoaded", () => {
  const storageList = JSON.parse(localStorage.getItem(EXPENSE_ITEM));

  if(storageList){
    storageList.forEach(item => {
      expenseAdd(item);
    });
  }
});

amount.oninput = () => {
  let value = amount.value.replace(/\D+/g, "");
  value = Number(value) / 100;
  amount.value = formatCurrencyBRL(value);
}

function formatCurrencyBRL(value){
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  expenseAdd(newExpense);
  formClear();
}

function expenseAdd(newExpense){
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");
    expenseItem.id = newExpense.id;

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;
    
    expenseInfo.append(expenseName, expenseCategory);

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`;

    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "./img/remove.svg");
    removeIcon.setAttribute("alt", "Remover");
    removeIcon.onclick = () => expenseRemove(newExpense.id);

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
    expenseList.append(expenseItem);

    updateTotals();
    list.push(newExpense);
    localStorage.setItem(EXPENSE_ITEM, JSON.stringify(list));

  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.");
    console.log(error);
  }
}

function updateTotals(){
  try {
    const items = expenseList.children;
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

    let total = 0;

    for(let item = 0; item < items.length; item++){
      const itemAmount = items[item].querySelector(".expense-amount");

      // Remover caracteres não numéricos e substituir a vírgula pelo ponto.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".");
      value = parseFloat(value);

      if(isNaN(value)){
        return alert("Não foi possível calcular o total. O valor não parece ser um número!");
      }

      total += Number(value);
    }

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    expensesTotal.innerHTML = "";
    expensesTotal.append(symbolBRL, total);

  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais.");
  }
}

function expenseRemove(id){
  document.getElementById(id).remove();

  const newList = list.filter((item) => item.id !== id);
  list = newList;
  localStorage.setItem(EXPENSE_ITEM, JSON.stringify(list));
}

function formClear(){
  expense.value = "";
  category.value = "";
  amount.value = "";
  
  expense.focus();
}