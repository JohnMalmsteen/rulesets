
<?php

  $columns =  array( array("name" => "sleepStart", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                  array("name" => "sleepEnd", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                  array("name" => "CoolingEndTime", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                  array("name" => "CookingEndTime", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                  array("name" => "StartDate", "type" => "DATE"),
                  array("name" => "EndDate", "type" => "DATE")
                );
  
 
  $triggers = array(
                      array("name"=>"row-updated"),
                      array("name"=>"time-elapsed")
                      );
  

  $actions = array(
    array("name" => "amber_cooling_times_event"),
    array("name" => "amber_sleep_interval_event"),
    array("name" => "red_cooling_times_event"),
    array("name" => "red_sleep_interval_event"),
    array("name" => "red_corretive_action")
  );
    
  $data = array("columns"=>$columns, "triggers"=>$triggers, "actions"=>$actions); 

  header('Content-Type: application/json');

  echo json_encode($data);

?>