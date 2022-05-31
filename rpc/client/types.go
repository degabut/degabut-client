package client

type Handshake struct {
	V        string `json:"v"`
	ClientID string `json:"client_id"`
}

type Payload[T any] struct {
	Cmd   string `json:"cmd"`
	Args  T      `json:"args"`
	Nonce string `json:"nonce"`
}

type AuthenticateCommandArgs struct {
	AccessToken string `json:"access_token"`
}

type Pan struct {
	Left  float32 `json:"left"`
	Right float32 `json:"right"`
}

type SetUserVoiceSettingsCommandArgs struct {
	UserId string `json:"user_id"`
	Volume int    `json:"volume"`
	Mute   bool   `json:"mute"`
	Pan    Pan    `json:"pan"`
}
