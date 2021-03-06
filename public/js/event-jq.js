'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

var usersData = {};
var itemsData = {};
var eventData = {};

function initializePage(){
    $('#detailsModal').on('show.bs.modal', openDetailsModal);
    $('#newItemModal').on('show.bs.modal', openAddItemModal);
    $('#add-category-field').hide();
    $('#submit-category-btn').click(submitCategory);
    $('#add-category-btn').click(addCategory);
    $('#addItemSubmitBtn').click(addItem);
    $('#claimSubmitBtn').click(claimItem);
    $('#deleteEventBtn').click(deleteEvent);
    $('.btn').click(clickAddItem);
    $('.dropdown toolbar-btn').click(clickPoints);
    $('.toolbar-btn').click(clickPoints);

    // Extract data
    eventData = $('#eventData').data('event');
    usersData = $('#eventData').data('users');
    itemsData = $('#eventData').data('items');

    initStepper(0, 100, 1);
}

function openAddItemModal(event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var category = button.data('category'); // Extract category to add to
    
    $(this).data('category', category);
  }

  function openDetailsModal(event) {
    var button = $(event.relatedTarget);

    var item = itemsData[button.data('item')];
    
    var modal = $(this);
    modal.find('.modal-title').text(item["name"]);
    modal.find('#item-quantity').text('x' + item.quantity);
    modal.find('#item-points').text(item.points + 'pts');
    modal.find('#item-details').text(item.description);
    modal.find('#claimSubmitBtn').data('itemid', item.id);

    var assignee_list = modal.find("#assignee-list");
    if (item['claimedBy'].length === 0){
        assignee_list.addClass('hidden');
        return;
    } else {
        assignee_list.removeClass('hidden');
    }

    var assignee_code = '<tbody>';
    for(const assignee in item.claimedBy){
        var user = usersData[assignee];
        assignee_code += '<tr scope="row">';
        assignee_code += "<td>" + makeAvatar(user.name) + "</td>";
        assignee_code += '<td class="center-cell">' + user.name + "</td>";
        assignee_code += "<td>x" + item.claimedBy[assignee] + "</td>";
        assignee_code +='</tr>';
    }

    assignee_code +='</tbody>';
    assignee_list.html(assignee_code)
  }

function makeAvatar(name){
    return "<div class=\"avatar\">" + name[0].toUpperCase() + "</div>";
}

function addCategory(){
    $('#add-category-field').show();
    $('#add-category-btn').hide();
}
function submitCategory(){
    $('#add-category-field').hide();
    $('#add-category-btn').show();
    var params = {category: $('#add-category-input')[0].value, eventId: eventData.id};
    $.post('/addcategory', params, function() {
        location.reload();
    });
}

function claimItem(){
    var itemId = $(this).data('itemid');

    var params = {itemId: itemId, quantity:  getStepperVal()}
    $.post('/claimitem', params, function(){
        location.reload();
    });
}

function addItem(){
    var params = {name: $('#inputItemName')[0].value, quantity: $('#inputQuantity')[0].value, points: $('#inputPoints')[0].value, description: $('#inputDetails')[0].value, category: $('#newItemModal').data("category"), eventId: eventData.id};

    $.post('/additem', params, function(){
        location.reload();
    });

}

function deleteEvent(e){
    $.post('/deleteEvent', {eventId: eventData.id});
}

function clickAddItem(e) {
   
    ga('send', 'event', 'addItem', 'click');
}

function clickPoints(e) {
    
    ga('send', 'event', 'points', 'click');
}