package app

import (
	"github.com/getlantern/systray"
	"github.com/suspiciouslookingowl/degabut-web/app/icon"
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

	mQuit := systray.AddMenuItem("Quit", "Quit the whole app")
	mShow := systray.AddMenuItem("Show", "Show the app")

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
