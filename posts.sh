# curl commands to test API requests
curl -v -H "Content-type: application/json" -X GET  http://localhost:5000/api/v1/participants
curl -v -H "Content-type: application/json" -X GET  http://localhost:5000/api/v1/participants?email=1
curl -v -H "Content-type: application/json" -X GET  http://localhost:5000/api/v1/occasions
curl -v -H "Content-type: application/json" -X GET  http://localhost:5000/api/v1/occasions?from=2018-11-15
curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"type":"declined"}'  http://localhost:5000/api/v1/attendance/44/type
curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"substitute":"14"}'  http://localhost:5000/api/v1/attendance/44/substitute
