#!/bin/bash

# Run Microsoft SQl Server and initialization script (at the same time)
/app/initDB.sh & /opt/mssql/bin/sqlservr