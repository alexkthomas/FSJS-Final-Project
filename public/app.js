
function getFiles() {
  return $.ajax('/api/file')
    .then(res => {
      console.log("Results from getFiles()", res);
      return res;
    })
    .fail(err => {
      console.error("Error in getFiles()", err);
      throw err;
    });
}

function refreshFileList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getFiles()
    .then(files => {

      window.fileList = files;

      const data = {files: files};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}

function handleAddFileClick() {
  console.log("Baby steps...");
  setFormData({});
  toggleAddFileFormVisibility();
}

function toggleAddFileFormVisibility() {
  $('#form-container').toggleClass('hidden');
}
// javascript function that submits the file form data
function submitFileForm() {
  console.log("You clicked 'submit'. Congratulations.");

  const fileData = {
   name: $('#name').val(),
   calories: $('#calories').val(),
   carbs: $('#carbs').val(),
   meal_type: $('input[name=meal_type]:checked').val(),
   _id: $('#meal-id').val(),
 };

  let method, url;
  if (fileData._id) {
    method = 'PUT';
    url = '/api/file/' + fileData._id;
  } else {
    method = 'POST';
    url = '/api/file';
  }

  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(fileData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshFileList();
      toggleAddFileFormVisibility();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    })

  console.log("Your file data", fileData);
}

function cancelFileForm() {
  toggleAddFileFormVisibility();
}
// java script that allows you to edit the file form
function handleEditFileClick(id) {
  const file = window.fileList.find(file => file._id === id);
  if (file) {
    setFormData(file);
    toggleAddFileFormVisibility();
  }
}


function setFormData(data) {
  data = data || {};

  const file = {
    name: data.name || '',
    calories: data.calories || '',
    carbs: data.carbs|| '',
    _id: data._id || '',
  };

  $('#name').val(file.name);
  $('#calories').val(file.calories);
  $('#carbs').val(file.carbs);
  $('#meal-id').val(file._id);
}

function handleDeleteFileClick(id) {
  if (confirm("Are you sure?")) {
    deleteFile(id);
  }
}
// javascript function that allows us to delete
function deleteFile(id) {
  $.ajax({
    type: 'DELETE',
    url: '/api/file/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("File", id, "is DOOMED!!!!!!");
      refreshFileList();
    })
    .fail(function(error) {
      console.log("I'm not dead yet!", error);
    })
}

refreshFileList();
