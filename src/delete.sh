#!/bin/bash
curl -sL https://app.snaplet.dev/get-cli/ | bash &> "/dev/null"

export PATH=/opt/buildhome/.local/bin/:$PATH

snaplet db delete --git