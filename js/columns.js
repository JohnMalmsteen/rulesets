function getColumns(){

 var promise = $.ajax(
 {
      url: "/some.php",
      dataType: 'json', 
      success: function(data) 
      {
          var i = 0;

          jQuery.each(data.columns, function(index, item)
          {

              //alert(JSON.stringify(item));
              var fitem = $(document.createElement("li")).attr("id", "li"+i);
              $("#columnsList").append(fitem);
              //var theItem = document.getElementById('li' + i);
              //theItem.innerHTML = "Item " + i;
              $("#li" + i).attr("class", "active ui-widget-content");

              var theLink = $(document.createElement("a")).attr({
                                                                  href: "index.html",
                                                                  id: "link" + i
                                                                });
              $("#li"+i).append(theLink);

              var theItem = document.getElementById('link'+i);
              theItem.innerHTML = item.name;

              var theIm = $(document.createElement("i")).attr("class", "fa fa-fw fa-clock-o draggable ui-widget-content");
              $("#li"+ i + " a").prepend(theIm);

              $(function() 
              {
                  //$( "#link" + i ).draggable({ grid: [ 20, 20 ] }); //Working
                  
                    $( "#link" + i ).draggable({
                          revert : function(event, ui) {
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
      },
      error: function(XMLHttpRequest, textStatus, errorThrown)
      {
          alert("Badness");
      }
  });

  for(var i = 0; i < 10; i++)
    {
     

    }

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

/*
    Conditional list for column when conditions:

      +
      -
      /
      *
      is not blank
      is blank
      <
      >
      <=
      >=
      !=
      ==
      %

      Alternate conditional:

      AND
      OR
      FINISHED
      +
      /
      -
      *
      %
*/
