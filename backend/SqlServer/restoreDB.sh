#!/bin/bash

# Restore DB creation script after updating data in LecturerService
dotnet ef dbcontext script --output "../SqlServer/creation_script.sql" --context HistoMapService.Model.LSContext