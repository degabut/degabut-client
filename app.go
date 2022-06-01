package main

import (
	"context"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var userHomeDir, _ = os.UserHomeDir()
var configFileName = ".degabut.json"
var configPath = userHomeDir + "/" + configFileName

type Config struct {
	AccessToken string `json:"access_token"`
}

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
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	http.HandleFunc("/oauth", a.oauthHandler)
	http.ListenAndServe(":39821", nil)
}

// Greet returns a greeting for the given name
func (a *App) SetAccessToken(token string) {
	// TODO: handle error

	config := Config{
		AccessToken: token,
	}
	configJson, err := json.Marshal(config)
	if err != nil {
		panic(err)
	}

	err = os.WriteFile(configPath, configJson, 0644)
	if err != nil {
		panic(err)
	}
}

func (a *App) GetAccessToken() string {
	// read json from file
	configJson, _ := ioutil.ReadFile(configPath)

	config := Config{}
	json.Unmarshal([]byte(configJson), &config)

	return config.AccessToken
}

func (a *App) oauthHandler(w http.ResponseWriter, req *http.Request) {
	accessToken, _ := io.ReadAll(req.Body)
	runtime.EventsEmit(a.ctx, "oauth", string(accessToken))
}
