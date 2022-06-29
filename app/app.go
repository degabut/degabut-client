package app

import (
	"context"
	"time"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx

	go func() {
		for {
			a.doUpdate()
			time.Sleep(30 * time.Minute)
		}
	}()

	go func() {
		a.initHttp()
	}()

	go func() {
		a.initTray()
	}()
}
