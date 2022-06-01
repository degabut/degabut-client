package rpc

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
	UserId string  `json:"user_id"`
	Volume float32 `json:"volume"`
	Mute   bool    `json:"mute"`
	Pan    Pan     `json:"pan"`
}

type SetActivityCommandArgs struct {
	Pid      int      `json:"pid"`
	Activity Activity `json:"activity"`
}

type Assets struct {
	LargeImage string `json:"large_image,omitempty"`
	LargeText  string `json:"large_text,omitempty"`
	SmallImage string `json:"small_image,omitempty"`
	SmallText  string `json:"small_text,omitempty"`
}

type Timestamps struct {
	Start int `json:"start,omitempty"`
	End   int `json:"end,omitempty"`
}

type Activity struct {
	State      string     `json:"state"`
	Details    string     `json:"details"`
	Timestamps Timestamps `json:"timestamps,omitempty"`
	Assets     Assets     `json:"assets,omitempty"`
}
