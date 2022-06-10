package main

import (
	"context"
	"embed"
	"net"
	"os"

	"github.com/degabut/degabut-client/app"
	"github.com/degabut/degabut-client/rpc"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

var clientId string

func main() {
	// limit to only one instance by locking a tcp port
	l, err := net.Listen("tcp", "localhost:39821")
	if err != nil {
		os.Exit(0)
	}

	// Create an instance of the app structure
	app := app.NewApp()
	rpc, _ := rpc.NewClient(clientId)

	// Create application with options
	err = wails.Run(&options.App{
		Title:     "Degabut",
		Width:     1048,
		Height:    768,
		MinWidth:  1048,
		MinHeight: 768,
		Frameless: true,
		Assets:    assets,
		OnStartup: app.Startup,
		OnShutdown: func(ctx context.Context) {
			l.Close()
		},
		Bind: []interface{}{
			app,
			rpc,
		},
	})

	if err != nil {
		println("Error:", err)
	}
}
