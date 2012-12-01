#!/bin/bash

echo "Making tiles"

montage tiles/*/*/*.png -tile 2x -geometry +0+0 -background none tiles.png
