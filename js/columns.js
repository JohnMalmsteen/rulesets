function getColumns(initialbool){

 var promise = $.ajax(
 {
      url: "/some.php",
      dataType: 'json', 
      success: function(data) 
      {
          var i = 0;

          var columnArea = document.getElementById("columnsList");
          while (columnArea.firstChild) {
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

          if(initialbool){
          
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


function AjaxColumns() {
  var result="";
  $.ajax({
    dataType: 'json',
    url:"some.php",
    async: false,
    success:function(data) {
       result = data;
    }
 });
 return result;
}

var c = 0;
var x = 0;
i =0;

function createInnerOperatorList(){
  var optionsArray = ['+', '-', '/', '*', '%', 'is blank', 'is not blank', '<', '>', '<=', '<=', '!=', '=='];

  var listWrap = $(document.createElement("li")).attr({id: "query-list-item"+x});
  $("#queryList").append(listWrap);  

  var fitem = $(document.createElement("select")).attr({id: "conditionalSelectorInternal"+c, onchange: "operatorChanged()"});
  fitem.addClass("cond_select");

  $("#query-list-item"+x).append(fitem);

  ++x;

  var operatorOption = $(document.createElement("option")).attr({
                                                                     id: "operatorOption" + i,
                                                                     value: "null"   
                                                                  });

  $("#conditionalSelectorInternal"+c).append(operatorOption);

  i++;

  jQuery.each(optionsArray, function(index, item)
  {
    operatorOption = $(document.createElement("option")).attr({
                                                                    id: "operatorOption" + i,
                                                                    value: item
                                                                  });

    $("#conditionalSelectorInternal"+c).append(operatorOption);

    var theOption = document.getElementById("operatorOption" + i);
    theOption.innerHTML = item;

    i++;

  });

  c++;

};

i=0;

var Oc = 0;

function createOuterOperatorList(){
  var optionsArray = ['+', '-', '/', '*', '%', 'AND', 'OR', 'FINISHED'];

  var fitem = $(document.createElement("select")).attr({id: "conditionalSelectorInternal"+Oc, onchange: "operatorChanged()"});

  $("#drop-area").append(fitem);

  var operatorOption = $(document.createElement("option")).attr({
                                                                     id: "operatorOption" + i,
                                                                     value: "null"   
                                                                  });

  $("#conditionalSelectorInternal"+c).append(operatorOption);

  i++;

  jQuery.each(optionsArray, function(index, item)
  {
    operatorOption = $(document.createElement("option")).attr({
                                                                    id: "operatorOption" + i,
                                                                    value: item
                                                                  });

    $("#conditionalSelectorInternal"+Oc).append(operatorOption);

    var theOption = document.getElementById("operatorOption" + i);
    theOption.innerHTML = item;

    i++;

  });

  Oc++;

};

function operatorChanged()
{/*
  var newDrop = $(document.createElement("li"));
  newDrop.attr("id", "droppable"); 
  newDrop.attr("class","ui-widget-header ui-droppable");
  $("#queryList").append(newDrop);
  */
};

