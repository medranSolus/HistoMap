FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY ["bin/Publish/*", "entrypoint.sh", "./"]
RUN mkdir -p runtimes; mv unix runtimes/unix
CMD /bin/bash ./entrypoint.sh