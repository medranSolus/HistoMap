FROM mcr.microsoft.com/mssql/server:2017-CU22-ubuntu-16.04
WORKDIR /app
COPY ["initDB.sh", "entrypoint.sh", "*.sql", "./"]
RUN chmod +x /app/initDB.sh
ENV SA_PASSWORD OhYouTuchMaTralala12!.
ENV ACCEPT_EULA Y
ENV MSSQL_PID Express
CMD /bin/bash ./entrypoint.sh