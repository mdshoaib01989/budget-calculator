'use strict';

;var budgetController = (function(){

	var Expenses = function(ID, description, value) {
		this.ID =  ID,
		this.description = description,
		this.value = value,
		this.percentage = -1
	}

	Expenses.prototype.calcPercentages =  function (totalIncome){
		if (data.totals.income > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percenage = -1;
		}
	}

	Expenses.prototype.getPercentages = function (){
		return this.percentage;;
	}

	var Income = function (ID, description, value){
		this.ID =  ID,
		this.description = description,
		this.value = value
	}

	var data = {
		allItems : {
			expense : [],
			income : []
		},
		totals : {
			expense : 0, 
			income : 0
		},

		budget : 0,
		percentage : -1
	};


	var calculateTotal = function (type){
		var sum = 0;
		data.allItems[type].forEach(function (current){
			sum = sum + current.value;
		})
		data.totals[type] = sum;
	}

	return {
		addItem :function (type, des, val){
			var newItem, ID;

			// [1 2 3 4], next id = 6;
			// [1 2 4 6], next id = 7;
			// id = next id + 1;

			//creating id for the each item
			if (data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].ID + 1 ; 
			}else {
				ID = 0;
			}

			// creating new item based on 'income' and 'expense'
			if (type === 'expense') {
				newItem = new Expenses(ID, des, val);
			} else if (type === 'income'){
				newItem = new Income (ID, des, val)
			}
			// pushing the new item into the data structure accordingly 
			data.allItems[type].push(newItem) // coz expense spelling in the logical statement and data strcture are same
			//another way data.allItems[expense].push(newItem1)
			//another way data.allItems[income].push(newItem2)
			// newItem1 = new Expense (id, des, val);
			// newItem2 = new Income (id, des, val)

			//returning the item
			return newItem;
		},

		deleteItem : function (type, id){
			var ids, index;
			// id = 5
			// data.allItems[type][id]
			// ids = [1 2 4 5 8]
			// index = 3
			ids = data.allItems[type].map (function (current){
					return current.ID;
				});

			index =  ids.indexOf(id);
			if (index !== -1){
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget : function (){
			// calculate total income and expenses
			calculateTotal('income');
			calculateTotal('expense');

			// calculate the budget :  income - expenses 
			data.budget = data.totals.income - data.totals.expense;

 			// calculate the percentage of income that we spent
 
 			if (data.totals.income > 0) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            } 
 			// ex :  expense = 100 and income = 300 ;  spent 0.3333% then 100/300 = 0.3333 * 100

 			
		},

		calculatePercentages : function (){
			 /*
				exp : a=10, b = 20, c= 30;
				total income = 100
				so percentages = a = 10 / 100 = 10%
				so percentages = b = 20 / 100 = 20%
				so percentages = c = 30 / 100 = 30%
			 */
			 data.allItems.expense.forEach(function (current){
			 	current.calcPercentages(data.totals.income);
			 });

		},

		getPercentages : function (){
			 var allPerc = data.allItems.expense.map(function (cur){
			 		return cur.getPercentages();
			 });
			 return allPerc;	
		},

		getBudget : function(){
			return {
				budget : data.budget,
				totalIncome : data.totals.income,
				totalExpense :  data.totals.expense,
				percentage : data.percentage 
			}
		},
		testing : function (){
			console.log(data)
		}
	}

})();

// UController module

var UIController = (function (){
	// creating a privet variable (object) for all classes, id's and other's
	var DomStrings = {
		inputType : '.add__type',
		inputDescription :  '.add__description', 
		inputValue : '.add__value',
		resultButton : '.add__btn',
		incomeContainer : '.income__list',
		expenseContainer : '.expenses__list',
		budgetLebel : '.budget__value',
		incomeLebel : '.budget__income--value',
		expenseLebel :  '.budget__expenses--value',
		percentageLebel : '.budget__expenses--percentage',
		container : '.container',
		expensePercentageLebel : '.item__percentage',
		dateLebel : '.budget__title--month'

	}

	var nodeListForEach = function (list, callback){
		for(i = 0; i < list.length; i ++){
			callback(list[i], i)
		}
	};

	// 1. get the input field data from user
	return {

		getDomStrings: function(){
			return DomStrings;
		},

		getInput: function(){
			return {
				type : document.querySelector(DomStrings.inputType).value,
				description : document.querySelector(DomStrings.inputDescription).value,
				value : parseFloat(document.querySelector(DomStrings.inputValue).value)
			}
		},

		addListItem : function (obj, type){
			var html, element;
			// create HTML strings from some placeholder Text

			if (type === 'income') {
				element = DomStrings.incomeContainer
				html = '<div class="item clearfix" id="income-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			} else if (type === 'expense' ) {
				element = DomStrings.expenseContainer
				html = '<div class="item clearfix" id="expense-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}
                        
                    
		// replace the place holder text with some actual data 
			newHtml = html.replace('%ID%' , obj.ID);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', this.formatNumber(obj.value, type));

		// Insert the HTML to the dom 

			document.querySelector(element).insertAdjacentHTML ('beforeend', newHtml );
			
		},

		deleteListItem : function (selectorid){
			var el = document.getElementById(selectorid);
			el.parentNode.removeChild(el)
		},
		
		clearFields : function (){
			var fields, fieldsArray;
			fields = document.querySelectorAll( DomStrings.inputDescription  + ',' + DomStrings.inputValue);

			var fieldsArray = Array.prototype.slice.call(fields);

			fieldsArray.forEach(function (current, index, array){
				current.value = "";
			})

			fieldsArray[0].focus();
		},

		displayBudget : function (obj){
			var type;
			obj.budget > 0 ? type = 'income' : type = 'expense' ;

			document.querySelector(DomStrings.budgetLebel).textContent = this.formatNumber(obj.budget, type);
			document.querySelector(DomStrings.incomeLebel).textContent = this.formatNumber(obj.totalIncome, 'income');
			document.querySelector(DomStrings.expenseLebel).textContent = this.formatNumber(obj.totalExpense, 'expense');

			if (obj.percentage > 0) {
				document.querySelector(DomStrings.percentageLebel).textContent = obj.percentage + '%';					
			} else {	
				document.querySelector(DomStrings.percentageLebel).textContent = '---';
			}
		},

		displayPercentages : function (percentages){

			var fields = document.querySelectorAll(DomStrings.expensePercentageLebel);

			nodeListForEach (fields, function (current, index ){
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});

		},

		formatNumber : function (num, type){
			var number, numSplit, int, dec; 
			/*
				+ OR - before the number
				exactly two seperating points
				and comma seperating for the thousend numbers

				ex :  1989.5622 -> 1,989.57
					  20 -> 20.00
					  100,000
			*/
			// To make the number positive no negetive value
			number = Math.abs(num);
			// To set two number after decimal point
			number = number.toFixed(2);
			numSplit = number.split('.');

			int = numSplit[0];

			if (int.length > 3 && int.length <= 5 ){
				int = int.substr(0, int.length -3) + ',' + int.substr(int.length - 3, 3 );
				// input 12500 outpur 12,500; 
			}
			else if (int.length > 5) {
				int =  int.substr(0, int.length - 5) + ',' + int.substr(int.length - 5, 2) + ',' + int.substr(int.length - 3, 3);
			}

			dec = numSplit[1]; 
			//type = 'expense' ? sign = '-' : sign = '+';
			return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;
			// or simply return (type = 'expense' ? '-' : '+') + ' ' + int + dec;
		},

		displayCurrentMonth : function (){
			var now, year, months, month;
			now = new Date ();

			months = ['January' , 'February', 'March', 'April', 'May', 'June' ,'July' , 'August' , 'September' , 'October' , 'November' , 'December'];
			month = now.getMonth();
			year =  now.getFullYear();
			document.querySelector(DomStrings.dateLebel).textContent = months[month] + ' ' + year;
		},

		changeType :  function (){
			var fields =  document.querySelectorAll(DomStrings.inputType + ',' + DomStrings.inputDescription + ',' + DomStrings.inputValue);

			nodeListForEach(fields, function (current){
				current.classList.toggle('red-focus')
			});	

			document.querySelector(DomStrings.resultButton).classList.toggle('red')
		}

	}

})();

// controller module

var controller =  (function (budgetCtrl, UICtrl){

	var setupEventListeners = function (){
		var dom =  UICtrl.getDomStrings();
		document.querySelector(dom.resultButton).addEventListener('click', ctlrAddItem);
		document.addEventListener('keypress', function (event){
			if (event.keyCode === 13 || event.which === 13) {
				ctlrAddItem();
			}
		});
		document.querySelector (dom.container).addEventListener('click', ctrlDeleteItem)
		document.querySelector(dom.inputType).addEventListener('change', UICtrl.changeType)
	};
	
	var updateBudget = function (){
		// 1. calculate the budget 
		budgetCtrl.calculateBudget();
		// 2. return the budget 
		var budget = budgetCtrl.getBudget();
		console.log(budget)
		// 3. Display the budget in the UI
		UICtrl.displayBudget(budget)
	}

	var updatePercentages = function (){

		// 1. first calculate the percentages
		budgetCtrl.calculatePercentages()

		// 2. read percentages from the budget conteroller
		var percentages = budgetCtrl.getPercentages();

		// 3. Update the UI with the percentages
		UICtrl.displayPercentages(percentages);
	}

	var ctlrAddItem = function (){
		var input, newItem;

		// 1. get the input field data
		input = UICtrl.getInput(); 

			// instead of !isNaN(input.value) i used input.value = "" 
		if (input.description !== "" && !isNaN(input.value) && input.value > 0 ){
			// 2. add collected item to the data structure as income and expense
			newItem = budgetController.addItem(input.type, input.description, input.value );
			console.log(newItem)
			// 3. Update the UI with item
			UICtrl.addListItem(newItem ,input.type);

			// 4. clear input fields data and back focus to the description box
			UICtrl.clearFields();

			// 5. calculate Budget and then update the budget to UI
			updateBudget();

			// 6. calculate and update percentages
			updatePercentages();
		}
	
	}

	var ctrlDeleteItem = function (event){
		var itemID, splitID, type, id; 

		 itemID = event.target.parentNode.parentNode.parentNode.id;

		if (itemID) {
			
			splitID = itemID.split('-');
			type = splitID[0];
			id = parseInt(splitID[1]);
 
			// 1. Delete an Item from the data structure
			budgetCtrl.deleteItem(type, id);

			// 2. Delete the item form the UI
			UICtrl.deleteListItem(itemID);

			// 3. calculate the budget and Update and show the new budget
			updateBudget();

			// 4. calculte and update percentages
			updatePercentages();
		}  

	};

	return {
		init : function(){
			console.log('application Started')
			UICtrl.displayCurrentMonth();
			UICtrl.displayBudget({
				budget : 0,
				totalIncome : 0,
				totalExpense :  0,
				percentage : 0
			})
			setupEventListeners();
			UICtrl.clearFields();
		}
	}

})(budgetController, UIController);

controller.init();
