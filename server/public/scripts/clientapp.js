$(document).ready(function(){
  appendTasks();
  getHoney();

//------- EVENT LISTENERS ----------------------------------------------------//
  $('#submit').on('click', postTask);

  $('#task-table-container').on('click', '.complete', completeTask);

  $('#task-table-container').on('click', '.remove', deleteTask);

});

//------- UTILITY FUNCTIONS --------------------------------------------------//
function deleteTaskResponse(res) {
  if (res == 'OK') {
    console.log('Task deleted!');
  } else {
    console.log('Task not deleted!!', res);
  }
}

function postTaskResponse(res) {
  if (res == 'Created') {
    appendTasks();
    console.log('Task recieved!');
  } else {
    console.log('Task rejected!!', res);
  }
}

//------- AJAX FUNCTIONS -----------------------------------------------------//

function getHoney(honey) {
  $.ajax ({
    type: "GET",
    url: "/honey",
    success: function(honey){
      $('#honey-drop-down').empty();
      honey.forEach(function(row) {
        var $el = $('<option value="'+ row.id +'">'+ row.first_name + '</option>');
        $('#honey-drop-down').append($el);
      });
    }
  });
}

function deleteTask(event) {
  event.preventDefault();

  var deletedTask = $(this).parent().parent().data('taskId');

  $.ajax ({
    type: 'DELETE',
    url: '/tasks/' + deletedTask,
    success: function (data) {
      deleteTaskResponse();
      appendTasks();
    }
  });
}

function completeTask(event) {
  event.preventDefault();

  var updatedTask = {};

    $.each($(this).parent().parent().find('input').serializeArray(), function(i, field) {
      updatedTask[field.name] = field.value;
    });

    updatedTask.taskId = $(this).parent().parent().data('taskId');

  $.ajax ({
    type: 'PUT',
    url: '/tasks/' + updatedTask.taskId,
    data: updatedTask,
    success: function (data) {
      appendTasks();
    }
  });
}

function appendTasks(tasks) {
  $.ajax ({
    type: "GET",
    url: "/tasks",
    success: function(tasks){
      $('#task-table-container').empty();
      $('#task-table-container').append('<tr>' +
             '<th>' + 'Honey' + '</th>' +
             '<th>' + 'Task' + '</th>' +
             '<th>' + 'Due Date' + '</th>' +
             '<th>' + 'Notes' + '</th>' +
             '<th>' + '' + '</th>' +
             '<th>' + '' + '</th>' +
             '</tr>');

      tasks.forEach(function(row) {
        var $el = $('<tr class="'+ row.complete +'">' +
             '<td>' + row.first_name + '</td>' +
             '<td>' + row.name + '</td>' +
             '<td>' + row.goal_date + '</td>' +
             '<td>' + row.description + '</td>' +
             '<td>' + '<button class="complete">Complete</button>' + '</td>' +
             '<td>' + '<button class="remove">Remove</button>' + '</td>' +
           '</tr>');
           $el.data('taskId', row.id);
           console.log(row.id);
        $('#task-table-container').append($el);
      });
    }
  });
}

function postTask(event) {
  getHoney();
  event.preventDefault();

  var task = {};

  $.each($('#task-enter-form').serializeArray(), function (i, field) {
    task[field.name] = field.value;
  });

  $('.taskField').val('');
  $.post('/tasks', task, postTaskResponse);
  appendTasks();
}
