
# Backend build
$BEND_OUT_DIR="bin/Publish"

cd backend/HistoMapService
New-Item -ItemType Directory -Force -Path "$BEND_OUT_DIR"
Remove-Item "$BEND_OUT_DIR" -Recurse
dotnet publish HistoMapService.csproj -c Release -o "$BEND_OUT_DIR"

cd "$BEND_OUT_DIR"
Remove-Item HistoMapService.pdb
Remove-Item runtimes/win* -Recurse
cd ../../../..

# Final build
docker-compose up --build