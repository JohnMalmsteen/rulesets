// tracks whether or not it is the first time the getColumns funtion is executed so that the selectors for actions etc don't get repopulated every time.
var initBool = true;

// flips the selector that is spawned between the options that include the logical operators and the 'outer operators' (AND/OR and FINISHED)
var outerOperatorBool = false;

// set when the suer reaches a finished state in the conditional, used to ensure there is a conditional for the rule
var conditionalFinished = false;
var cron_str = "";
var cron_eng_str = "";

function init()
{
  if(initBool)
  {
    var e = document.getElementById("droppable");
    $("#droppable").attr('class','drop-unlock-color');
    $("#droppable").empty().append('<p>Drag & Drop a Column Here</p>');
    initBool = false;
  }
}

function getColumns(initialbool)
{
 init();
 // Ajax calls the php file which is running on the server with it, but could be anywhere, receives a json object in return
 $.ajax(
 {
      //this can be changed to any URL
      url: "/some.php",
      dataType: 'json',
      success: function(data)
      {
          var i = 0;

          //this piece of code removes all the elements in the columns list, if there are any.
          var columnArea = document.getElementById("columnsList");

          while (columnArea.firstChild)
          {
              columnArea.removeChild(columnArea.firstChild);
          }

          // iterates through each column (json file is structed to have arrays of columns, triggers and actions)
          jQuery.each(data.columns, function(index, item)
          {
              // create a list item with li[x] id and append it to the columnsList
              var fitem = $(document.createElement("li")).attr("id", "li"+i);
              $("#columnsList").append(fitem);

              // give the list item attributes for the CSS and draggable jquery-ui
              $("#li" + i).attr("class", "active draggable ui-widget-content");

              // create an <a> and attach it to the previous <li> and fill the inner html with the item name
              var theLink = $(document.createElement("a")).attr({
                                                                  id: "link" + i
                                                                });
              $("#li"+i).append(theLink);

              var theItem = document.getElementById('link'+i);
              theItem.innerHTML = item.name;

              // adding images from fontawesome to the column names based on what type of data they contain, here is only date and time
              // there are loads of icons in the package and more types could be account for here, and there is a else condition 'meh' case
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

              // create the image and prepend it
              var theIm = $(document.createElement("i")).attr("class", "fa fa-fw " + imageString + " ui-widget-content").attr("id", "image");
              $("#li"+ i + " a").prepend(theIm);

              // this function deals with the draggable events
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

          // this part is only executed if it is the first time the function is called
          if(initialbool)
          {

            // appends a null option first
            var triggerOption = $(document.createElement("option")).attr({
                                                                            id: "triggerOption0",
                                                                            value: "null"
                                                                          });

            $("#triggerSelect").append(triggerOption);

            i = 1;

            // iterates through the triggers array and loads them into the triggers selector
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

            // same algorithm for the actions although we are then clonin the elements and adding them to the false action selector also.
            var actionOption = $(document.createElement("option")).attr({
                                                                            id: "actionOption0",
                                                                            value: "null"
                                                                          });

            $("#actionSelect").append(actionOption);
            $("#actionOption0").clone().appendTo("#falseActionSelect")
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

                $("#actionOption" + i).clone().appendTo("#falseActionSelect")

                i++;
            });
          }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown)
      {
        // on error with ajax/php
        alert("Data Not Recieved");
      }
  });
}

// counters
var c = 0;
var x = 0;
i = 0;

// this function actually serves to create all of the operator selectors that spawn in when items are dragged or numericals are appended.
function createInnerOperatorList()
{
  var optionsArray;

  // the boolean operates heuristically to deal with some general syntax ie. you cant get two logical operators before an AND.
  // you must also have 1 logical operator in the conditional so something is being evaluated
  if(!outerOperatorBool)
  {
    optionsArray = ['+', '-', '/', '*', '%', 'is blank', 'is not blank', '<', '>', '<=', '<=', '!=', '=='];
  }
  else
  {
    optionsArray = ['+', '-', '/', '*', '%', 'AND', 'OR', 'FINISHED'];
  }

  // The conditional statement is built up into a <ul> so we first create a <li> and append it to the queryList
  var listWrap = $(document.createElement("li")).attr({id: "query-list-item"+x});

  $("#queryList").append(listWrap);

  // create the select and give it id and onchange attributes then give it a class for CSS
  var fitem = $(document.createElement("select")).attr({id: "conditionalSelector", onchange: "operatorChanged()"});

  fitem.addClass("cond_select");

  // and append it to the the li we just created
  $("#query-list-item"+x).append(fitem);

  ++x;

  // append a null option to the selector so it is empty by default
  var operatorOption = $(document.createElement("option")).attr({
                                                                     id: "operatorOption" + i,
                                                                     value: "null"
                                                                  });

  $("#conditionalSelector").append(operatorOption);

  i++;

  // iterates through the array that got selected earlier and attaches each on as the inner html of the option
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

// this function deals with the droppable area
$(function()
{
  $( "#droppable" ).droppable(
  {
     drop: function(event, ui )
     {

      // when a column is dropped into the area it creates a new <li> in the queryList and appends the dropped column name to it
      var listWrap = $(document.createElement("li")).attr({id: "query-list-item"+x});
      $("#queryList").append(listWrap);

      // selectes the 2nd child node of the droped element (as the first child is the <i> image), which is the text name of the column
      var elem = $(ui.draggable)[0].childNodes[1].nodeValue;

      // the columns are now reset
      getColumns(false);

      // the text name of the dropped column is added to the query list
      $("#query-list-item"+x).append(elem);

      x++;

      createInnerOperatorList();

      // the droppable area is disabled until a option is selected from the operator selector
      // some CSS is also applied and the message is changed within the droppable area
      $("#droppable").attr('class','drop-lock-color');
      $("#droppable").empty().append('<p>Dropping disabled, Please select operator.</p>');
      $("#droppable").droppable('option', 'disabled', true);

      // the button associated with the number input is also disabled, these two turn on and off together
      var button = document.getElementById("appendNumericalButton");
      button.disabled = true;
     }
  });
});

i = 0;

// this function deals with when the operator selector is changed
function operatorChanged()
{
  // pulls out the value of the selected option
  var selectedValue = $("#conditionalSelector option:selected").val();

  // removes the selector from the query list
  var parent = $("#conditionalSelector").parentNode;
  $("#conditionalSelector").remove();

  // provided the selected value isn't the FINISHED option then it is then appended to the queryList in place of the selector
  if(selectedValue != "FINISHED"){
    $("#query-list-item" + (x-1)).append(selectedValue);
  }

  // button and droppable area are turned on again
  $("#droppable").attr('class','drop-unlock-color');
  $("#droppable").empty().append('<p>Drag & Drop a Column Here</p>');
  $("#droppable").droppable('option', 'disabled', false);

  var button = document.getElementById("appendNumericalButton");
  button.disabled = false;

  // if the selected option is either of these then we have the logical operator for this expression and need the outer operator list: ie, now we need an AND/OR/FINISHED
  if(selectedValue == "is blank" || selectedValue == "is not blank")
  {
    outerOperatorBool = true;
    createInnerOperatorList();
    outerOperatorBool = false;

    $("#droppable").attr('class','drop-lock-color');
    $("#droppable").empty().append('<p>Dropping disabled, Please select operator.</p>');
    $("#droppable").droppable('option', 'disabled', true);

    button.disabled = true;

  }

  // if the option is any of these then we can only do arithmetic operators or compound operators on the next selector
  if(selectedValue == "<" || selectedValue == ">" || selectedValue == "==" || selectedValue == "<=" || selectedValue == ">=")
  {
    outerOperatorBool = true;
  }

  // and vice versa, we must get a logical operator before we can go back to compound operators or FINISHED
  if(selectedValue == "AND" || selectedValue == "OR")
  {
    outerOperatorBool = false;
  }

  // if the query is finished the button and droppable are disabled and the boolean to indicate finished is set to true.
  if(selectedValue == "FINISHED")
  {
    $("#droppable").attr('class','drop-lock-color');
    $("#droppable").empty().append('<p>Dropping disabled, Rule Composition Finished</p>');
    $("#droppable").droppable('option', 'disabled', true);

    var button = document.getElementById("appendNumericalButton");
    button.disabled = true;

    var listItems = $("#queryList");

    conditionalFinished = true;

  }

};

// this function loops through the queryList to build up the conditional and returns it as a string
function getConditional(){
    var ifString = "";

    // pulls out each li element in the queryList
    jQuery.each($("#queryList li"), function(index, item){
      ifString += $(item).text();
      ifString += " ";
    });

    return ifString;
}

// if the trigger selected is the Every x [time] option then we need to create the number input and unit selector
function triggerChanged(val)
{
  if(val.value.toUpperCase().indexOf("EVERY-[X]-TIME") >= 0)
  {
      // values are chosen like this so they match the syntax required  without any further editing later "Year(s)" may look nicer than "years" though
      var myOptions =
      {
          val1 : 'years',
          val2 : 'months',
          val3 : 'weeks',
          val4 : 'days',
          val5 : 'hours',
          val6 : 'minutes'
      };
      // creates the input and selector and appends them into the triggerwrap div
      var mySelect = $('#triggerwrap');
      var mytpick;

      mySelect.append("<label style='margin-right:5px'>Every: </label>");
      mySelect.append("<input id='numeral' value='0' min='0' type=number style='width:80px;'>");

      mySelect.append("<select id='tpick'>");

      mytpick = $('#tpick');

      // iterates through the myOtions array and appends each as an option
      $.each(myOptions, function(val, text)
      {
          mytpick.append($('<option></option>').val(val).html(text));
      });

      mySelect.append('</select>');
  }
}
// this is the function associated with the button "submit" beside the number input and is used for adding numerical values into the conditional expressions
function appendNumerical()
{
  // selects the value of the number entered
  var numerical = document.getElementById("numericalInput").value;

  // as before we create an <li> in the queryList for the new element
  var listWrap = $(document.createElement("li")).attr({id: "query-list-item"+x});
  $("#queryList").append(listWrap);

  $("#query-list-item"+x).append(numerical);

  x++;

  // follows the same logic as for when a column is dropped in
  createInnerOperatorList();

  // droppable and button are disabled
  $("#droppable").attr('class','drop-lock-color');
  $("#droppable").empty().append('<p>Dropping disabled, Please select operator.</p>');
  $("#droppable").droppable('option', 'disabled', true);

  var button = document.getElementById("appendNumericalButton");
  button.disabled = true;

}

// this function handles the submit button which builds up the rule in proper syntax etc
function submitRule()
{

  // pulls out allt he relevent values
  var ruleName = document.getElementById("ruleName").value;
  var triggerName = document.getElementById("triggerSelect").value;
  var actionName = document.getElementById("actionSelect").value;
  var conditional = getConditional();
  var falseAction = document.getElementById("falseActionSelect").value;

  // the false action is optional
  if (falseAction == "null")
  {
    falseAction = "";
  }
  else
  {
    falseAction = ", " + falseAction;
  }


  // builds the trigger in case of every [x] time trigger selected
  if(triggerName == "every-[x]-time")
  {
    var pickval = $("#tpick").find(":selected").text();
    var numeral = $("#numeral").val();

    triggerName = "every " + numeral + " years";
  }

  // big ugly contional block that enforces rulename, trigger selection, action selection and conditional finished
  if(ruleName == "")
  {
    alert("You must enter a name for your rule");
  }
  else if(triggerName == "null")
  {
    alert("You must select a trigger");
  }
  else if(actionName == "null")
  {
    alert("You must select an action");
  }
  else if(conditionalFinished != true)
  {
    alert("You must complete your conditional");
  }
  else
  {
    // builds the string and alerts it
    var ruleString = "Rule: " + ruleName + " Begin\n\t" + "Trigger: " + triggerName
    + "\n\t" + "if ((" + conditional + "), " + actionName + falseAction + ") end\nEnd";
    alert(ruleString);

    // this variable can just as easily be ajaxed over to a php script or ruby or whatever else the target may be.
  }

}
