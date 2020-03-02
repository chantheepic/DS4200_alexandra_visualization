<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app = new \Slim\App;

// Get All Intersections
$app->get('/api/alexandra/trafficflow/time/{startTime}/{endTime}', function(Request $request, Response $response){
    $startTime = $request->getAttribute('startTime');
    $endTime = $request->getAttribute('endTime');
    $query = "SELECT *, hour(time) as hour, minute(time) as minute FROM washington WHERE time(time) > '$startTime' AND time(time) < '$endTime' AND type = 'cars';";
    return fetch_a($query, $response);
});
$app->get('/api/alexandra/trafficflow/timetype/{startTime}/{endTime}/{type}', function(Request $request, Response $response){
    $startTime = $request->getAttribute('startTime');
    $endTime = $request->getAttribute('endTime');
    $type = $request->getAttribute('type');
    $query = "SELECT *, hour(time) as hour, minute(time) as minute FROM washington WHERE time(time) > '$startTime' AND time(time) < '$endTime' AND type = '$type';";
    return fetch_a($query, $response);
});
$app->get('/api/alexandra/trafficflow/timetotal/{startTime}/{endTime}', function(Request $request, Response $response){
    $startTime = $request->getAttribute('startTime');
    $endTime = $request->getAttribute('endTime');
    $type = $request->getAttribute('type');
    $query = "SELECT type, sum(`int-total`) as total FROM washington WHERE time(time) > '$startTime' AND time(time) < '$endTime' GROUP BY type;";
    return fetch_a($query, $response);
});
$app->get('/api/alexandra/trafficflow/total', function(Request $request, Response $response){
    $query = "SELECT `intewashingtonrsection`, `type`, sum(`int-total`) as total from intersection WHERE intersection = 'washington' group by `type`;";
    return fetch_a($query, $response);
});
$app->get('/api/alexandra/trafficflow/total/{type}', function(Request $request, Response $response){
    $type = $request->getAttribute('type');
    $query = "SELECT `washington`, `type`, sum(`int-total`) as total from intersection WHERE intersection = 'washington' AND type = '$type';";
    return fetch_a($query, $response);
});
$app->get('/api/alexandra/trafficflow', function(Request $request, Response $response){
    $startTime = $request->getAttribute('startTime');
    $endTime = $request->getAttribute('endTime');
    $query = "SELECT *, hour(time) as hour, minute(time) as minute FROM washington WHERE time(time) > '07:00' AND time(time) < '17:00';";
    return fetch_a($query, $response);
});
$app->get('/api/ping', function(Request $request, Response $response){
    echo 'pong';
});

function fetch_a($query, $response){
    try{
        $database = new AlexandraDatabase();
        $database = $database->connect();

        $statement = $database->query($query);
        $result = $statement->fetchAll(PDO::FETCH_OBJ);
        $database = null;
        return $response->withJson($result, 200);
    } catch(PDOException $e){
        return $response->withStatus(500);
    }
}
?>