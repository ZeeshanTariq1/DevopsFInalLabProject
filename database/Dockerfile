FROM mongo:6

# Copy initialization script
COPY init-db.js /docker-entrypoint-initdb.d/

EXPOSE 27017

VOLUME ["/data/db"]