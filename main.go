package main

import (
	"embed"

	"github.com/suspiciouslookingowl/degabut-web/rpc"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

var clientId string

func main() {
	// Create an instance of the app structure
	app := NewApp()
	rpc, _ := rpc.NewClient(clientId)

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Degabut",
		Width:     1048,
		Height:    768,
		MinWidth:  1048,
		MinHeight: 768,
		Frameless: true,
		Assets:    assets,
		OnStartup: app.startup,
		Bind: []interface{}{
			app,
			rpc,
		},
	})

	if err != nil {
		println("Error:", err)
	}
}
