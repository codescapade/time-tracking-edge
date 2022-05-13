window.onload = async () => {
  const input = document.querySelector('#newItem');
  const buttonParent = document.querySelector('#buttonList');
  const editButton = document.querySelector('#editButton');


  const data = await loadData();
  addButtons(data.buttons, buttonParent);

  document.querySelector('#addButton').addEventListener('click', async (ev) => {
    if (input.value != undefined && input.value != '' && data.buttons.indexOf(input.value) == -1) {
      data.buttons.push(input.value);
      addButton(buttonParent, input.value);
      input.value = '';
      await saveData(data);
    }
  });

  let editing = false;
  editButton.addEventListener('click', (ev) => {
    editing = !editing;
    editButton.innerHTML = editing ? 'Done' : 'Edit';

    const buttons = document.querySelectorAll('.item-button')
    for (let button of buttons) {
      if (editing) {
        button.classList.add('red-button');
      } else {
        button.classList.remove('red-button');
      }
    }
  });

  document.querySelector('#clear').addEventListener('click', async (ev) => {
    data.trackingData = [];
    data.activeTask = '';
    await saveData(data);
    console.log(data);
  });

  document.querySelector('#export').addEventListener('click', (ev) => {
    let csv = '';
    for (let row of data.trackingData) {
      csv += `${row.name},${row.startTime},${row.endTime}\n`;
    }
    const blob = new Blob([csv], { type: 'text/plain' });
    const link = document.createElement('a');
        const date = new Date();
        const format = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    link.download = `tracking_export_${format}.csv`;
    link.href = window.URL.createObjectURL(blob);
    link.click();
    window.close();
  });

  function addButtons(buttons, parent) {
    for (let buttonName of buttons) {
      addButton(parent, buttonName);
    }
  }

  function addButton(parent, name) {
    const button = document.createElement('button');
    button.classList.add('item-button');
    button.innerHTML = name;
    button.addEventListener('click', async (ev) => {
      if (editing) {
        parent.removeChild(button);
        data.buttons.splice(data.buttons.indexOf(name), 1);
        await saveData(data);
      } else {
        const date = new Date();
        const format = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        if (data.activeTask != '') {
          data.trackingData[data.trackingData.length - 1].endTime = format;
        }

        if (data.activeTask !== name) {
          data.activeTask = name;
          data.trackingData.push({
            name: name,
            startTime: format,
            endTime: '',
          });
        } else {
          console.log(name);
          data.activeTask = '';
        }

        await saveData(data);
        console.log(data);
      }
      console.log('clicking new button called' + name)
    });
    parent.appendChild(button);
  }
};

function loadData() {
  const promise = new Promise((resolve, reject) => {
    chrome.storage.local.get('saveData', (result) => {
      if (result.saveData != undefined) {
        resolve(result.saveData);
      } else {
        resolve({
          activeTask: '',
          buttons: [],
          trackingData: []
        });
      }
    });
  });

  return promise;
}

function saveData(data) {
  const promise = new Promise((resolve, reject) => {
    chrome.storage.local.set({ saveData: data}, () => {
      resolve();
    });
  });

  return promise;
}