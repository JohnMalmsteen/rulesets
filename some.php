
<?php

  $data = array( "column" => array( array("name" => "sleepStart", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                                    array("name" => "sleepEnd", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                                    array("name" => "CoolingEndTime", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                                    array("name" => "CookingEndTime", "type" => "TIME", "lowBound" => 0, "highBound" => 24.61),
                                    array("name" => "StartDate", "type" => "DATE"),
                                    array("name" => "EndDate", "type" => "DATE")
                                  )
  );
  header('Content-Type: application/json');

  echo json_encode($data);

?>
