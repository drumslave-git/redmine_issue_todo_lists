(function($) {
    "use strict";

    var fixWidth = function(e, ui) {
        ui.children().each(function() {
            $(this).width($(this).width());
        });

        return ui;
    };

    var calculateOddEvenStyle = function() {
        $('#issue-todo-list-table > tbody > tr').each(function(index, tr) {
            tr = $(tr);
            tr.removeClass('odd');
            tr.removeClass('even');

            if(index % 2 == 0) {
                tr.addClass('odd');
            } else {
                tr.addClass('even');
            }

            tr.find('td.issue-todo-list-item-order').text(index + 1)
        });
    };

    var updateOrder = function(e, ui) {
        var itemOrder = $('#issue-todo-list-table > tbody').sortable('serialize', {
            key: 'item[]'
        });

        $.ajax({
            type: 'POST',
            url: window.location.href + '/update_item_order',
            data: itemOrder,
            dataType: 'html',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Accept', 'text/javascript');
            },
            success: function(response) {
                eval(response);
            },
            error: function() {
                alert('Error while ordering. Please reload the page.');
            }}
        );

        calculateOddEvenStyle();
    };

    const editItem = function(e){
        $.ajax(e.currentTarget.href).success(item => {
            $('#update_issue_todo_list_items_wrapper').show();
            $('#update_issue_todo_list_items').attr('action', e.currentTarget.href);
            $('#update_issue_todo_list_items textarea').val(item.comment);
        })
    };

    const updateItem = function(e){
        const data = {
            item: {
                comment: $('#update_issue_todo_list_items textarea').val()
            }
        }
        $.ajax({
            type: 'PUT',
            url: $('#update_issue_todo_list_items').attr('action'),
            data,
            dataType: 'html',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Accept', 'text/javascript');
            },
            success: function(response) {
                eval(response);
            },
            error: function() {
                alert('Error while ordering. Please reload the page.');
            }}
        );
    }

    $(document).ready(function() {
        // $('#issue-todo-list-table.sortable > tbody').sortable({
        //     cancel: 'a',
        //     //containment: 'parent',
        //     cursor: 'move',
        //     placeholder: 'issue-todo-list-drop',
        //     helper: fixWidth,
        //     update: updateOrder
        // });
        $('#issue-todo-list-table.sortable > tbody').sortable({
            cancel: 'a',
            itemSelector: 'tr',
            // containment: '#issue-todo-list-table.sortable',
            placeholder: '<tr class="placeholder"/>',
            axis: "y",
            forcePlaceholderSize: true,
            opacity: 0.5,
            tolerance: "intersect",
            helper: fixWidth,
            update: updateOrder,
            start: function(e, ui){
                ui.placeholder.height(ui.item.height());
            }
        });
        $('#issue-todo-list-table').on('click', '.edit_item', function (e) {
            e.preventDefault();
            editItem(e);
        })
        // $('#issue-todo-list-table #update_issue_todo_list_items').on('submit', function (e) {
        //     e.preventDefault();
        //     updateItem(e);
        //     return false;
        // })
    });
})(jQuery);