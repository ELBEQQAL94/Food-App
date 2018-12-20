/*Storage Controller*/
const StorageCtrl = (function(){
    
    // Public methods
    return {
      storeItem : function(item) {
        let items;

        // check if any items in localStorage
        if(localStorage.getItem('Items') === null){
            items = [];

            //push new item
            items.push(item);

            //Set in local storage
            localStorage.setItem('Items', JSON.stringify(items));

        } else {

            // Get what is already in localStorage
            items = JSON.parse(localStorage.getItem('Items'));

            // push new item
            items.push(item);

            // Reset in localStorage
            localStorage.setItem('Items', JSON.stringify(items));
        }
      },

      getItemFromlocalStorage : function() {
          let items;
          if(localStorage.getItem('Items') === null) {
            items = [];
          } else {
              items = JSON.parse(localStorage.getItem('Items'));
          }

          return items;

      },

      updateItemStorage : function(updatedItem) {
       let items = JSON.parse(localStorage.getItem('Items'));
       items.forEach((item, index) => {
           if(updatedItem.id === item.id) {
            items.splice(index, 1, updatedItem);
           }
       });

       localStorage.setItem('Items', JSON.stringify(items));
      },

      deleteItemFromStorage : function(id) {
        let items = JSON.parse(localStorage.getItem('Items'));
        items.forEach((item, index) => {
            if(id === item.id) {
                items.splice(index, 1);
            }
        });

        localStorage.setItem('Items', JSON.stringify(items));

      },
      clearAllFromStorage : function() {
        //localStorage.clear(); 
        // Or 
        localStorage.removeItem('Items');

      }
    }
  })();

/*Item Controller*/
const ItemCtrl = (function() {

    // Item constructor
    const Item = function(id, name, calories) {
       this.id       = id;
       this.name     = name;
       this.calories = calories;
    }

    // Data Structure
    const data = {
        items         : StorageCtrl.getItemFromlocalStorage(),
        currentItem   : null,
        totalCalories : 0
    }

    // Public methods
    return {
        getItems : function() {
            return data.items;
        },

        addItem  : function(name, calories) {

            // Create ID
            let ID;
            if(data.items.length > 0) {
              ID = data.items[data.items.length - 1].id + 1;
            } else {
              ID = 0;
            }

            // Create new item
            const newItem = new Item(ID, name, calories);

            // Push new item in data structure
            data.items.push(newItem);

            return newItem;
          },

        setCurrentItem   : function(itemToEdit) {
          data.currentItem = itemToEdit;
        },

        getCurrentItem : function() {
          return data.currentItem;
        },

        getTotalCalories : function() {
            let total = 0;
            data.items.forEach(item => {
                total += parseInt(item.calories);
            });

            // Set total cal in data structure
           data.totalCalories = total;

           // Return total
           return data.totalCalories;
        },
        getItemById  : function(id) {
           let found = null;

           // Loop through items
           data.items.forEach(item => {
               if(item.id === id) {
                found = item;
               }
           });
           return found;
        },
        updateItem : function(name, calories) {
          let found = null;
          data.items.forEach(item => {
            if(item.id === data.currentItem.id) {
                item.name = name;
                item.calories = calories;
                found = item;
            }
          });
          return found;
        },

        deleteItem : function(id) {
         // Get ids
         const ids = data.items.map(item => item.id);

         // Get index
         const index = ids.indexOf(id);

         // Remove item
         data.items.splice(index, 1);

        },

        clearItems : function() {
          data.items = [];
        },

        logData  : function() {
            return data;
        }
    }
    
})();

/*UI Controller*/
const UICtrl = (function() {

    const UISlectors = {
        ItemList       : '#item-list',
        AddBtn         : '.add-btn',
        name_Input     : '#name',
        calories_Input : '#calories',
        total_calories : '.total-calories',
        delete_Btn     : '.delete-btn',
        update_Btn     : '.update-btn',
        back_Btn       : '.back-btn',
        list_Items     : '#item-list li',
        clear_Btn      : '.clear-btn'
    }

   // Public methods
   return {
      populateItemList : function(items) {
         let html = '';
         items.forEach(item =>{
            html += `
              <li id="item-${item.id}" class="collection-item">
                <strong>${item.name} : </strong>
                <em>${item.calories} calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>
                    `;
         });

         // Insert list Items
         document.querySelector(UISlectors.ItemList).innerHTML = html; 
      },

      getItemInput : function() {
          return {
              name     : document.querySelector(UISlectors.name_Input)             .value,
              calories : document.querySelector           (UISlectors.calories_Input).value
            }
        },

        addItemList : function(item) {
           // Show the Ul
           document.querySelector(UISlectors.ItemList)
           .style.display = 'block';

          // Create li element
          const li = document.createElement('li');

          // Add class
          li.className = 'collection-item';

          // Add ID
          li.id = `item-${item.id}`;

          // Add HTML
          li.innerHTML = `<strong>${item.name} : </strong>
                          <em>${item.calories} calories</em>
                          <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                          </a>`;

         // Insert item
         document.querySelector(UISlectors.ItemList).insertAdjacentElement('beforeend', li);
        },

        clearFields : function() {
         document.querySelector(UISlectors.name_Input).value     = '';

         document.querySelector(UISlectors.calories_Input).value = '';
        },

        hideList : function() {
            document.querySelector(UISlectors.ItemList)
            .style.display = 'none';
        },

        showTotalCalories : function(totalCalories) {
            document.querySelector(UISlectors.total_calories)
            .textContent = totalCalories;
        },

        clearEditState : function() {
          UICtrl.clearFields();

          document.querySelector(UISlectors.AddBtn)
          .style.display = 'inline';

          document.querySelector(UISlectors.delete_Btn)
          .style.display = 'none';

          document.querySelector(UISlectors.update_Btn)
          .style.display = 'none';

          document.querySelector(UISlectors.back_Btn)
          .style.display = 'none';
        },

        addItemToForm : function() {
            document.querySelector(UISlectors.name_Input).value = ItemCtrl.getCurrentItem().name;

            document.querySelector(UISlectors.calories_Input).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },

        showEditState : function() {
          document.querySelector(UISlectors.AddBtn)
          .style.display = 'none';

          document.querySelector(UISlectors.delete_Btn)
          .style.display = 'inline';

          document.querySelector(UISlectors.update_Btn)
          .style.display = 'inline';

          document.querySelector(UISlectors.back_Btn)
          .style.display = 'inline';
        },

        upDateListItem : function(item) {
          let listItems = document.querySelectorAll(UISlectors.list_Items);

          // Turn node list into array
          listItems = Array.from(listItems);

          listItems.forEach(listItem => {
             const itemId = listItem.getAttribute('id');
             if(itemId === `item-${item.id}`) {
               document.querySelector(`#${itemId}`).innerHTML =   `<strong>${item.name} : </strong>
                 <em>${item.calories} calories</em>
                  <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                  </a>`;
             }
          });
        },

        deleteItemList : function(id) {
           const itemId = `#item-${id}`;

           const item = document.querySelector(itemId);
           alert('Are you sure');

           item.remove();
        },

        clearItemsList : function() {
          let itemList = document.querySelectorAll(UISlectors.list_Items);

          // turn node list into array
          const itemListArr = Array.from(itemList);
          itemListArr.forEach(item => {
              item.remove();
          });
        },

        getSelectors : function() {
            return UISlectors;
        }
    }
})();

/*App Controller*/
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
    // Load event Listeners
    const loadEventListeners = function() {

        // Get UI selectors
        const UISlectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISlectors.AddBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', e => {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISlectors.ItemList)
        .addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISlectors.update_Btn)
        .addEventListener('click', updateItemSubmit);

        // Back button event
        document.querySelector(UISlectors.back_Btn)
        .addEventListener('click', UICtrl.clearEditState);

        // Delete button event
        document.querySelector(UISlectors.delete_Btn)
        .addEventListener('click', deleteItem);

        // Clear Items event
        document.querySelector(UISlectors.clear_Btn)
         .addEventListener('click', clearItems);
    }

    // Add item submit
    const itemAddSubmit = function(e) {
        // Get form input from UI controller
        const input = UICtrl.getItemInput();

        // Check for name and calorie input
        if(input.name !== '' && input.calories !== '') {
           //Add item
           const newItem = ItemCtrl.addItem(input.name, input.calories);

           // Add item to UI list
           UICtrl.addItemList(newItem);

           // Get total calories
           const totalCalories = ItemCtrl.getTotalCalories();

           // Add total calories to UI
           UICtrl.showTotalCalories(totalCalories);

           // Store item in localeStorage
           StorageCtrl.storeItem(newItem);

           // Clear fields
           UICtrl.clearFields();
        }
        e.preventDefault();
    }

    // Update item click
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')) {
           // Get item id
           const listId = e.target.parentElement.parentElement.id;
           const listArr= listId.split('-');

           // Get the actual id
           const id = parseInt(listArr[1]);

           // Get item
           const itemToEdit = ItemCtrl.getItemById(id);

           // Set current item
           ItemCtrl.setCurrentItem(itemToEdit);

           // Add item to form
           UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    // Update item submit
    const updateItemSubmit = function(e) {
       // Get item input
       const input = UICtrl.getItemInput();

       // Update item
       const updatedItem =ItemCtrl.updateItem(input.name, input.calories);

       // update UI
       UICtrl.upDateListItem(updatedItem);

       // Get total calories
       const totalCalories = ItemCtrl.getTotalCalories();

       // Add total calories to UI
       UICtrl.showTotalCalories(totalCalories);

       // Update from localStorage
       StorageCtrl.updateItemStorage(updatedItem);

       // Clear edit state
       UICtrl.clearEditState();

       e.preventDefault();
    }

    // Delete Item
    const deleteItem = function(e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete item from UI
        UICtrl.deleteItemList(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        // Update state
        UICtrl.clearEditState();

        e.preventDefault(); 
    }

    // Clear items
    const clearItems = function(e){
        // Clear all items from data structure
        ItemCtrl.clearItems();

        // Clear all items from UI
        UICtrl.clearItemsList();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update state
        UICtrl.clearEditState();

        // Clear all from local storage
        StorageCtrl.clearAllFromStorage();

        // Hide Ul
        UICtrl.hideList();

        e.preventDefault(); 
    }
    // Public methods
    return {
        init : function() {
            // Clear init state
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Chack any items there
            if(items.length === 0) {
              UICtrl.hideList();
            } else {
              // Populate list with items
              UICtrl.populateItemList(items);
            }
            // Get total calories
           const totalCalories = ItemCtrl.getTotalCalories();

           // Add total calories to UI
           UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl, StorageCtrl);

// Initializing App Controller
App.init();