# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "puphpet/ubuntu1404-x64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  config.vm.provision "file", source: "provision/bashrc", destination: "~/.bashrc"

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision "shell", inline: <<-SHELL
  	set -e

    sudo apt-get update
	sudo apt-get install -y g++ graphviz libxml2-dev sqlite3 npm nodejs

	if [ ! -d /llvm-2.9 ]; then
		# klee-src-squashfs
		img=/vagrant/provision/llvm29.squashfs
		mountdir=/tmp/llvm-2.9
		tmpfs=/tmp/rwfs1

		echo "Mounting LLVM 2.9 image"
		sudo mkdir -p $mountdir
		sudo mount -o loop $img $mountdir
		sudo mkdir -p $tmpfs
		sudo mount -t aufs -o dirs=$tmpfs=rw:$mountdir=ro unionfs $mountdir

		echo "Installing LLVM 2.9"
		cp -r $mountdir /llvm-2.9
		sudo chmod 777 /llvm-2.9/
		sudo chmod 777 /llvm-2.9/install/lib/
		sudo chmod 777 /llvm-2.9/lib/Transforms/
		sudo chmod 777 /llvm-2.9/Release+Asserts/lib/

		echo "Unmounting LLVM image"
		umount $mountdir
	fi

	# z3
	if [[ ! $(hash z3 2> /dev/null) ]]; then
		echo "Installing Z3"
		cd
		tar -xvzf /vagrant/provision/z3.tar.gz
		cd z3-89c1785b7322/build
		sudo make install
		make examples
		sudo rm -rf ~/z3-89c1785b7322
	fi
  SHELL
end
