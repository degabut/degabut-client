#/bin/sh

if [ -z "$GOBIN" ]; then
    echo GOBIN environment variable not set
    exit
fi

if [ ! -e "$GOBIN/2goarray" ]; then
    echo "Installing 2goarray..."
    go install github.com/cratonica/2goarray@latest
    if [ $? -ne 0 ]; then
        echo Failure executing go install github.com/cratonica/2goarray@latest
        exit
    fi
fi

if [ -z "$1" ]; then
    echo Please specify a PNG file
    exit
fi

if [ ! -f "$1" ]; then
    echo $1 is not a valid file
    exit
fi    

OUTPUT=icon_notwin.go
echo Generating $OUTPUT
echo "//+build linux darwin" > $OUTPUT
echo >> $OUTPUT
cat "$1" | $GOBIN/2goarray Data icon >> $OUTPUT
if [ $? -ne 0 ]; then
    echo Failure generating $OUTPUT
    exit
fi
echo Finished