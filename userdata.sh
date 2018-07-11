#!/bin/bash -v
sudo apt-get update

# certbot
sudo apt-get update && sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:certbot/certbot
sudo apt-get update
sudo apt-get install -y python-certbot-nginx

# latest nginx
sudo add-apt-repository -y ppa:nginx/stable
sudo apt-get update
sudo apt-get install -y nginx

# install node 8
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo ln -s "$(which nodejs)" /usr/bin/node

# install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install -y yarn
echo "alias yarn='/usr/bin/yarn'" >> .bashrc

# install git
sudo apt-get update && sudo apt-get install -y git-all

# install build-essential
sudo apt-get update && sudo apt-get install -y build-essential
