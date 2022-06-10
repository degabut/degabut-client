@ECHO OFF

IF "%GOBIN%"=="" GOTO NOGO
IF NOT EXIST %GOPATH%\2goarray.exe GOTO INSTALL
:POSTINSTALL
IF "%1"=="" GOTO NOICO
IF NOT EXIST %1 GOTO BADFILE
ECHO Creating icon_windows.go
ECHO //+build windows > icon_windows.go
ECHO. >> icon_windows.go
TYPE %1 | %GOPATH%\2goarray Data icon >> icon_windows.go
GOTO DONE

:CREATEFAIL
ECHO Unable to create output file
GOTO DONE

:INSTALL
ECHO Installing 2goarray...
go install github.com/cratonica/2goarray@latest
IF ERRORLEVEL 1 GOTO GETFAIL
GOTO POSTINSTALL

:GETFAIL
ECHO Failure running go install github.com/cratonica/2goarray@latest.  Ensure that go and git are in PATH
GOTO DONE

:NOGO
ECHO GOBIN environment variable not set
GOTO DONE

:NOICO
ECHO Please specify a .ico file
GOTO DONE

:BADFILE
ECHO %1 is not a valid file
GOTO DONE

:DONE