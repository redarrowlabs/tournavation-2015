cp /home/vagrant/jenkins/infrastructure/* /vagrant
cp /home/vagrant/jenkins/infrastructure/*.* /vagrant
sudo ifconfig | grep inet
sudo NODE_TLS_REJECT_UNAUTHORIZED=0 SSL_KEY_PATH=/vagrant/self-signed-cert.key SSL_CERT_PATH=/vagrant/self-signed-cert.crt SCRIPT_URL=https://localhost:443 CONNECT_STRING=mongodb://mongoAdmin:O5RrPDcVh@localhost:27017/healthHeroesDb npm run start:prod
