package app

import (
	"io"
	"net/http"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) initHttp() {
	http.HandleFunc("/oauth", a.oauthHandler)
	http.ListenAndServe(":39821", nil)
}

func (a *App) oauthHandler(w http.ResponseWriter, req *http.Request) {
	accessToken, _ := io.ReadAll(req.Body)
	runtime.EventsEmit(a.ctx, "oauth", string(accessToken))
}
