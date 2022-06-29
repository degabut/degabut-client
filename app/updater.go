package app

import (
	"encoding/json"
	"net/http"

	"github.com/minio/selfupdate"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Meta struct {
	Version string `json:"version"`
}

var version string
var metaUrl string
var binaryUrl string

func (a *App) doUpdate() error {
	resp, err := http.Get(metaUrl)

	if err != nil {
		return err
	}
	defer resp.Body.Close()

	meta := &Meta{}
	json.NewDecoder(resp.Body).Decode(meta)

	if meta.Version <= version {
		return nil
	}

	resp, getUpdateErr := http.Get(binaryUrl + "/" + meta.Version + "/degabut.exe")
	if getUpdateErr != nil {
		return getUpdateErr
	}

	defer resp.Body.Close()
	updateErr := selfupdate.Apply(resp.Body, selfupdate.Options{})
	if updateErr != nil {
		return updateErr
	} else {
		runtime.EventsEmit(a.ctx, "update")
	}

	return nil
}
