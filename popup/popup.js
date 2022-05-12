window.onload = () => {
  const input = document.querySelector('#newItem');
  const buttonParent = document.querySelector('#buttonList');

  let items = [];
  chrome.storage.local.get('addedItems', function(result) {
    if (result.addedItems != undefined) {
      for (let item of result.addedItems) {
        items.push(item);
      }
    }

    addButtons(items, buttonParent)
  });

  document.getElementById('addButton').addEventListener('click', (ev) => {
    if (input.value != undefined && input.value != '' && items.indexOf(input.value) == -1) {
      items.push(input.value);
      addButton(buttonParent, input.value);

      chrome.storage.local.set({addedItems: items}, function() {
        console.log('updated items in localstorage');
      });
    }
  });

  let editing = false;
  document.querySelector('#editButtons').addEventListener('click', (ev) => {
    editing = !editing;
    const buttons = document.querySelectorAll('.item-button')
    for (let button of buttons) {
      if (editing) {
        button.classList.add('red-button');
      } else {
        button.classList.remove('red-button');
      }
    }
  });
};

function addButtons(items, parent) {
  for (let item of items) {
    addButton(parent, item);
  }
}

function addButton(parent, name) {
  const button = document.createElement('button');
  button.classList.add('item-button');
  button.innerHTML = name;
  button.addEventListener('click', (ev) => {
    console.log('clicking new button called' + name)
  });
  parent.appendChild(button);
}