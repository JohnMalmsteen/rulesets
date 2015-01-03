var initBool = true;

function init()
{
  if(initBool)
  {
    var e = document.getElementById("droppable");
    $("#droppable").attr('class','drop-unlock-color');
    initBool = false;
  }
}

function getColumns(initialbool)
{
 init();

 var promise = $.ajax(
 {
      url: "/some.php",
      dataType: 'json', 
      success: function(data) 
      {
          var i = 0;
          var columnArea = document.getElementById("columnsList");
          
          while (columnArea.firstChild) 
          {
              columnArea.removeChild(columnArea.firstChild);
          }

          jQuery.each(data.columns, function(index, item)
          {
              //alert(JSON.stringify(item));
              var fitem = $(document.createElement("li")).attr("id", "li"+i);
              $("#columnsList").append(fitem);
              //var theItem = document.getElementById('li' + i);
              //theItem.innerHTML = "Item " + i;
              $("#li" + i).attr("class", "active draggable ui-widget-content");

              var theLink = $(document.createElement("a")).attr({
                                                                  id: "link" + i
                                                                });
              $("#li"+i).append(theLink);

              var theItem = document.getElementById('link'+i);
              theItem.innerHTML = item.name;

              var imageString;

              if(item.type.toUpperCase() == "TIME"){
                imageString = "fa-clock-o";
              }
              else if (item.type.toUpperCase() == "DATE"){
                imageString = "fa-calendar-o";
              }
              else{
                imageString = "fa-meh-o";
              }

              var theIm = $(document.createElement("i")).attr("class", "fa fa-fw " + imageString + " ui-widget-content");
              $("#li"+ i + " a").prepend(theIm);

              $(function() 
              {
                  //$( "#link" + i ).draggable({ grid: [ 20, 20 ] }); //Working
                  
                    $( "#link" + i ).draggable({
                          drag: function(event, ui) {
                              
                          },
                          helper: "clone",
                          containment:"document",
                          revert : function(event, ui)
                          {
                              // on older version of jQuery use "draggable"
                              // $(this).data("draggable")
                              // on 2.x versions of jQuery use "ui-draggable"
                              // $(this).data("ui-draggable")
                              $(this).data("uiDraggable").originalPosition = {
                                  top : 0,
                                  left : 0
                              };

                              // return boolean
                              return !event;
                              // that evaluate like this:
                              // return event !== false ? false : true;
                          }
                      });

                      $("#droppable").droppable();
                  });

              i++;

          });

          if(initialbool)
          {          
            var triggerOption = $(document.createElement("option")).attr({
                                                                            id: "triggerOption0", 
                                                                            value: "null"
                                                                          });

            $("#triggerSelect").append(triggerOption);

            i = 1;

            jQuery.each(data.triggers, function(index, item)
            {
                var triggerOption = $(document.createElement("option")).attr({
                                                                                id: "triggerOption" + i,
                                                                                value: item.name
                                                                              });

                $("#triggerSelect").append(triggerOption);

                var theOption = document.getElementById("triggerOption" + i);
                theOption.innerHTML = item.name;

                i++;
            });

            var actionOption = $(document.createElement("option")).attr({
                                                                            id: "actionOption0", 
                                                                            value: "null"
                                                                          });

            $("#actionSelect").append(actionOption);

            i = 1;

            jQuery.each(data.actions, function(index, item)
            {
                var actionOption = $(document.createElement("option")).attr({
                                                                                id: "actionOption" + i,
                                                                                value: item.name
                                                                              });

                $("#actionSelect").append(actionOption);

                var theOption = document.getElementById("actionOption" + i);
                theOption.innerHTML = item.name;

                i++;
            });
          }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown)
      {
          alert("Badness");
      }
  });
}

var c = 0;
var x = 0;
i =0;

function createInnerOperatorList()
{
  var optionsArray = ['+', '-', '/', '*', '%', 'is blank', 'is not blank', '<', '>', '<=', '<=', '!=', '=='];
  //var optionsArray = ['+', '-', '/', '*', '%', 'AND', 'OR', 'FINISHED'];

  var listWrap = $(document.createElement("li")).attr({id: "query-list-item"+x});
  
  /*
     Debug Zone of Terror
  */

  $('#queryList').cron();

  /*
     Debug Zone of Terror
  */


  $("#queryList").append(listWrap);  

  var fitem = $(document.createElement("select")).attr({id: "conditionalSelector", onchange: "operatorChanged()"});
  fitem.addClass("cond_select");

  $("#query-list-item"+x).append(fitem);

  ++x;

  var operatorOption = $(document.createElement("option")).attr({
                                                                     id: "operatorOption" + i,
                                                                     value: "null"   
                                                                  });

  $("#conditionalSelector").append(operatorOption);

  i++;

  jQuery.each(optionsArray, function(index, item)
  {
    operatorOption = $(document.createElement("option")).attr({
                                                                    id: "operatorOption" + i,
                                                                    value: item
                                                                  });

    $("#conditionalSelector").append(operatorOption);

    var theOption = document.getElementById("operatorOption" + i);
    theOption.innerHTML = item;

    i++;

  });

  c++;

};

$(function() 
{
  $( "#droppable" ).droppable(
  {
     drop: function(event, ui )
     {
      var listWrap = $(document.createElement("li")).attr({id: "query-list-item"+x});
      $("#queryList").append(listWrap);  

      var elem = ui.draggable;
      getColumns(false);
      elem.appendTo($("#query-list-item"+x));

      x++;

      createInnerOperatorList();
    
      $("#droppable").attr('class','drop-lock-color');
      $("#droppable").droppable('option', 'disabled', true);

      //this disables the droppable from any further drops until it is turned back on, this should perhaps change the CSS or 
      //inner html of the droppable to indicate that it is no longer accepting drops and the user should select an operator from the selector
     }
  });
});

i = 0;

function operatorChanged()
{
  var selectedValue = $("#conditionalSelector option:selected").val();
  var parent = $("#conditionalSelector").parentNode;
  $("#conditionalSelector").remove();

  var theSelectedOperator = $(document.createElement("a")).attr({
                                                                  id: "selected" + i
                                                                })

  $("#query-list-item" + (x-1)).append(theSelectedOperator);

  var theListItem = document.getElementById("selected" + i);
  theListItem.innerHTML = selectedValue;

  $("#droppable").attr('class','drop-unlock-color');
  $("#droppable").droppable('option', 'disabled', false);
};

