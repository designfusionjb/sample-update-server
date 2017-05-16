rem List all files
curl -X GET http://localhost:3000/api/files

rem Add new file
curl -X PUT -H "Content-Type: application/json" -d "{\"sha1\":\"89E5FDB811D6209D6E89CF9114BC5E44B66A8882\",\"size\":323584, \"name\": \"FileLocker.exe\"}" http://localhost:3000/api/files
curl -X PUT -H "Content-Type: application/json" -d "{\"sha1\":\"958E5456C6360FF64B8201254A8BB43CEE2993BF\",\"size\":323584, \"name\": \"WMIExplorer.exe\"}" http://localhost:3000/api/files

rem Get file by id
curl -X GET http://localhost:3000/api/files/1

rem Update file by id
curl -X PUT -H "Content-Type: application/json" -d "{\"name\": \"NewName.exe\"}" http://localhost:3000/api/files/1

rem Delete file by id
curl -X DELETE http://localhost:3000/api/files/1
