#!/bin/bash

echo "Making tiles"


for folder in tiles/*/*; do
	name=`basename $folder`
	montage $folder/*.png -tile 2x -geometry +0+0 -background none $name.png
done

#montage *.png -tile 4x -geometry +0+0  -background none asdf.png
