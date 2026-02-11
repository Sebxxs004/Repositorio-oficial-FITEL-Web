FROM mariadb:10.11

# Copiar scripts de inicialización
COPY init/ /docker-entrypoint-initdb.d/
# Copiar carpeta sql referenciada por los scripts
COPY sql/ /docker-entrypoint-initdb.d/sql/

# Variables de entorno por defecto (pueden ser sobreescritas)
ENV MYSQL_DATABASE=fitel_db
ENV MYSQL_ROOT_PASSWORD=rootpassword123
