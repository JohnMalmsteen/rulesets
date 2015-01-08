<?php

  $columns =  array( 
                      array("name" => "sleepStart", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                      array("name" => "sleepEnd", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                      array("name" => "CoolingEndTime", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                      array("name" => "CookingEndTime", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                      array("name" => "StartDate", "type" => "DATE"),
                      array("name" => "EndDate", "type" => "DATE")
                   );
  
 
  $triggers = array(
                      array("name"=>"row-updated"),
                      array("name"=>"on-save"),
                      array("name"=>"on-approval"),
                      array("name"=>"every-[x]-time")
                   );
  

  $actions = array(
                      array("name" => "amber_cooling_times_event"),
                      array("name" => "amber_sleep_interval_event"),
                      array("name" => "red_cooling_times_event"),
                      array("name" => "red_sleep_interval_event"),
                      array("name" => "red_corretive_action"),
                      array("name" => "generate_amber_event"),
                      array("name" => "generate_red_event"),
                      array("name" => "generate_amber_daily_cleaning_schedule_event"),
                      array("name" => "generate_red_daily_cleaning_schedule_event")
                 );
    
  $data = array("columns"=>$columns, "triggers"=>$triggers, "actions"=>$actions); 

  header('Content-Type: application/json');

  echo json_encode($data);

?>
