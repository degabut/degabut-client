package app

import (
	"github.com/degabut/degabut-client/app/icon"
	"github.com/getlantern/systray"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) initTray() {
	go func() {
		systray.Run(a.onTrayReady, a.onTrayExit)
	}()
}

func (a *App) onTrayReady() {
	systray.SetIcon(icon.Data)
	systray.SetTitle("Degabut")

	mShow := systray.AddMenuItem("Show", "Show the app")
	mQuit := systray.AddMenuItem("Quit", "Quit the whole app")

	go func() {
		<-mQuit.ClickedCh
		systray.Quit()
	}()

	go func() {
		for {
			select {
			case <-mShow.ClickedCh:
				runtime.WindowShow(a.ctx)
			}
		}
	}()
}

func (a *App) onTrayExit() {
	runtime.Quit(a.ctx)
}
