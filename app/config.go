package app

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

var userHomeDir, _ = os.UserHomeDir()
var configFileName = ".degabut.json"
var configPath = userHomeDir + "/" + configFileName

type Config struct {
	AccessToken string `json:"access_token"`
}

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
