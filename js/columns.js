function getColumns(){

  for(var i = 0; i < 10; i++)
    {
      var item = $(document.createElement("li")).attr("id", "li"+i);
      $("#columnsList").append(item);
      //var theItem = document.getElementById('li' + i);
      //theItem.innerHTML = "Item " + i;
      $("#li" + i).attr("class", "active");

      var theLink = $(document.createElement("a")).attr({
                                                          href: "index.html",
                                                          id: "link" + i
                                                        });
      $("#li"+i).append(theLink);

      var theItem = document.getElementById('link'+i);
      theItem.innerHTML = "Column " +i;

      var theIm = $(document.createElement("i")).attr("class", "fa fa-fw fa-clock-o");
      $("#li"+ i + " a").prepend(theIm);


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
*/
