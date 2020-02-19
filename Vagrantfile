# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.box = 'digital_ocean'
    config.vm.box_url = "https://github.com/devopsgroup-io/vagrant-digitalocean/raw/master/box/digital_ocean.box"
    config.ssh.private_key_path = '~/.ssh/id_rsa'
    config.vm.synced_folder ".", "/vagrant", type: "rsync"

    config.vm.define "backend", primary: true do |server|
      server.vm.provider :digital_ocean do |provider|
        provider.ssh_key_name = ENV["SSH_KEY_NAME"]
        provider.token = ENV["DIGITAL_OCEAN_TOKEN"]
        provider.image = 'ubuntu-18-04-x64'
        provider.region = 'fra1'
        provider.size = '1gb'
        provider.privatenetworking = true
      end

      server.vm.hostname = "backend"

      server.vm.provision "shell", inline: <<-SHELL
        echo "Running: cd ../vagrant/"
        cd ../vagrant/
        echo "Current Directory is now: "$PWD
        echo "Running: apt --yes install docker-compose"
        apt --yes install docker-compose
        echo "Running: docker-compose build"
        docker-compose build
        echo "Running: docker-compose up"
        docker-compose up -d
      SHELL
    end

    config.vm.provision "shell", privileged: false, inline: <<-SHELL
      sudo apt-get update
    SHELL
  end