FROM httpd

RUN mkdir /opt/cvServer/ &&\
    mkdir /usr/local/apache2/htdocs/pubfiles &&\
    chmod 777 /usr/local/apache2/htdocs/pubfiles &&\
    mkdir /srv/cvserver_data/ &&\
    mkdir /srv/cvserver_data/txt/ &&\
    mkdir /srv/cvserver_data/triples/ &&\
    mkdir /var/log/cvServer



RUN apt-get update && apt-get upgrade && apt-get install -y wget openjdk-7-jre less unzip jq


#Server goes to /opt/cvServer/
ADD cvManagement/ /opt/cvServer/cvManagement
ADD doc/ /opt/cvServer/doc
ADD fuseki/ /opt/cvServer/fuseki
ADD java_exec/ /opt/cvServer/java_exec
ADD run/ /opt/cvServer/run
ADD UserTracking/ /opt/cvServer/UserTracking
ADD www_content/ /opt/cvServer/www_content
ADD Settings/dockerSettings /opt/cvServer/Settings

COPY install.sh Settings/dockerSettings/dockerinstall.sh /opt/cvServer/

RUN /opt/cvServer/install.sh &&\
    /opt/cvServer/dockerinstall.sh &&\
    cp -rf /opt/cvServer/www_content/* /usr/local/apache2/htdocs/ &&\
    cp /opt/cvServer/Settings/log_location.setting /opt/cvServer/cvManagement/ &&\
    cp /opt/cvServer/Settings/cvServerlocation.setting /opt/cvServer/cvManagement/


#Mariadb
RUN export DEBIAN_FRONTEND=noninteractive && \
 echo "mariadb-server mysql-server/root_password password adminpw" | debconf-set-selections &&\
 echo "mariadb-server mysql-server/root_password_again password adminpw" | debconf-set-selections &&\
 apt-get install -y mariadb-server &&\
 service mysql start &&\
 mysql -uroot -padminpw -e "Create Database cvTracking;" &&\
 mysql -uroot -padminpw cvTracking < /opt/cvServer/UserTracking/UserTracking.sql &&\
 mysql -uroot -padminpw cvTracking -e "CREATE USER 'worker'@'localhost' IDENTIFIED BY 'workerpassword';" &&\
 mysql -uroot -padminpw cvTracking -e "GRANT ALL ON cvTracking.* TO 'worker'@'localhost';"

#RUN sed -i -e '$i \service httpd start\n' /etc/rc.local &&\
RUN sed -i -e '$i \service mysql start\n' /etc/rc.local &&\
 sed -i -e '$i \bash /opt/cvServer/cvManagement/fuseki_start.sh\n' /etc/rc.local &&\
 sed -i -e '$i \bash /opt/cvServer/cvManagement/node_start.sh\n' /etc/rc.local &&\
 sed -i -e '$i \httpd-foreground\n' /etc/rc.local


WORKDIR /opt/cvServer/cvManagement/

CMD ["/etc/rc.local"]
