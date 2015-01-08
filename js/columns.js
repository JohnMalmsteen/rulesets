var initBool = true;
var outerOperatorBool = false;
var conditionalFinished = false;
var cron_str = "";

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

              var theIm = $(document.createElement("i")).attr("class", "fa fa-fw " + imageString + " ui-widget-content").attr("id", "image");
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
  var optionsArray;

  if(!outerOperatorBool)
  {
    optionsArray = ['+', '-', '/', '*', '%', 'is blank', 'is not blank', '<', '>', '<=', '<=', '!=', '=='];
  }
  else
  {
    optionsArray = ['+', '-', '/', '*', '%', 'AND', 'OR', 'FINISHED'];
  }
  //var optionsArray = ['+', '-', '/', '*', '%', 'AND', 'OR', 'FINISHED'];

  var listWrap = $(document.createElement("li")).attr({id: "query-list-item"+x});

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
      var elem = $(ui.draggable)[0].childNodes[1].nodeValue;

      //var elem = ui.draggable;
      getColumns(false);
    
      $("#query-list-item"+x).append(elem);

      x++;

      createInnerOperatorList();
    
      $("#droppable").attr('class','drop-lock-color');
      $("#droppable").empty().append('<p>Dropping disabled, Please select operator.</p>');
      $("#droppable").droppable('option', 'disabled', true);

      var button = document.getElementById("appendNumericalButton");
      button.disabled = true;

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

  if(selectedValue != "FINISHED"){
    $("#query-list-item" + (x-1)).append(selectedValue);
  }

  $("#droppable").attr('class','drop-unlock-color');
  $("#droppable").empty().append('<p>Drag & Drop a Column Here</p>');
  $("#droppable").droppable('option', 'disabled', false);

  var button = document.getElementById("appendNumericalButton");
  button.disabled = false;

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

  if(selectedValue == "<" || selectedValue == ">" || selectedValue == "==" || selectedValue == "<=" || selectedValue == ">=")
  {
    outerOperatorBool = true;
  }

  if(selectedValue == "AND" || selectedValue == "OR")
  {
    outerOperatorBool = false;
  }

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

function getConditional(){
    var ifString = "";

    jQuery.each($("#queryList li"), function(index, item){
      ifString += $(item).text();
      ifString += " ";
    });

    return ifString;
}

function triggerChanged(val)
{  
  /*
  Debug Zone of Terror
  */

  if(val.value.toUpperCase().indexOf("EVERY-[X]-TIME") >= 0)
  {
      var myOptions =
      {
          val1 : 'Year',
          val2 : 'Month',
          val3 : 'Week',
          val4 : 'Day',
          val5 : 'Hour',
          val6 : 'Minute'
      };

      var mySelect = $('#triggerArea');
      var mytpick;

      mySelect.append("<input id='numeral' value='0' type=number style='width:80px;margin:4px'>");

      mySelect.append("<select id='tpick'>");

      mytpick = $('#tpick');

      $.each(myOptions, function(val, text) 
      {
          mytpick.append($('<option></option>').val(val).html(text));
      }); 

      mySelect.append('</select>');  
  }  

  /*
   Debug Zone of Terror
  */
}

function appendNumerical()
{
  var numerical = document.getElementById("numericalInput").value;

  var listWrap = $(document.createElement("li")).attr({id: "query-list-item"+x});
  $("#queryList").append(listWrap);

  $("#query-list-item"+x).append(numerical);

  x++;

  createInnerOperatorList();

  $("#droppable").attr('class','drop-lock-color');
  $("#droppable").empty().append('<p>Dropping disabled, Please select operator.</p>');
  $("#droppable").droppable('option', 'disabled', true);

  var button = document.getElementById("appendNumericalButton");
  button.disabled = true;

}

function submitRule()
{
  var ruleName = document.getElementById("ruleName").value;
  var triggerName = document.getElementById("triggerSelect").value;
  var actionName = document.getElementById("actionSelect").value;
  var conditional = getConditional();

  if(ruleName == "")
  {
    alert("You must enter a name for your rule");
  }
  else if(triggerName == null)
  {
    alert("You must select a trigger");
  }
  else if(actionName == null)
  {
    alert("You must select an action");
  }
  else if(conditionalFinished != true)
  {
    alert("You must complete your conditional");
  }
  else
  {
    var ruleString = "Rule: " + ruleName + " Begin\n\t" + "Trigger: " + triggerName 
    + "\n\t" + "if ((" + conditional + "), " + actionName + ") end\nEnd";
    alert(ruleString);

    /*    
    Cron String 
    */

    var pickval = $("#tpick").find(":selected").text();
    var numeral = $("#numeral").val();

    var temp;

    if(pickval == "Year")
    {
        var currentdate = new Date();
        temp = currentdate.getYear(); 
        temp  = currentdate + "/" + numeral; 
        cron_str = "* * * * * * " + temp;
    }
    else if(pickval == "Month")
    {
        temp  = "*/" + numeral;
        cron_str = "* * " + temp + " * *";
    }
    else if(pickval == "Week")
    {
        temp  = "*/" + numeral;
        cron_str = "* * * " + temp + " *";
    }
    else if(pickval == "Day")
    {
        temp  = "*/" + numeral;
        cron_str = "* * " + temp + " * *";
    }
    else if(pickval == "Hour")
    {
        temp  = "*/" + numeral;
        cron_str = "* " + temp + " * * *";
    }
    else if(pickval == "Minute")
    {
        temp  = "*/" + numeral;
        cron_str = temp + " * * * *" ;
    }     

    alert(cron_str);

    /*    
    Cron String 
    */

  }

}



/*"Rule:" name "Begin"
  "TRIGGER:" every 10 minutes
  "if" ((a > b), true, false) "end"
"End"*/