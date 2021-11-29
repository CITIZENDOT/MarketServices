#!/bin/bash

PKG_MANAGER="yarn"

if ! command -v node &> /dev/null
then
    echo "[-] Node.JS isn't installed."
    exit 1
else
    echo "[+] Node.JS found"
fi

if ! command -v $PKG_MANAGER &> /dev/null
then
    echo "[-] Yarn isn't installed. Switching to npm..."
    PKG_MANAGER="npm"
else
    echo "[+] Yarn is set as package manager."
fi

$PKG_MANAGER install;
sudo systemctl start mysql;
node server.js;