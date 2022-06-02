package rpc

import (
	"encoding/json"
	"os"

	"github.com/suspiciouslookingowl/degabut-web/rpc/ipc"
)

type Client struct {
	logged bool
	socket ipc.Socket
}

// Login sends a handshake in the socket and returns an error or nil
func (c *Client) Authenticate(accessToken string) error {
	if c.logged {
		return nil
	}

	payload, _ := json.Marshal(Payload[AuthenticateCommandArgs]{
		"AUTHENTICATE",
		AuthenticateCommandArgs{
			AccessToken: accessToken,
		},
		getNonce(),
	})

	// TODO: parse response
	c.socket.Send(1, string(payload))

	c.logged = true

	return nil
}

func (c *Client) Close() {
	c.logged = false

	err := c.socket.Close()
	if err != nil {
		panic(err)
	}
}

func (c *Client) SetUserVoiceSettings(args SetUserVoiceSettingsCommandArgs) error {
	if !c.logged {
		return nil
	}

	payload, _ := json.Marshal(Payload[SetUserVoiceSettingsCommandArgs]{
		"SET_USER_VOICE_SETTINGS",
		args,
		getNonce(),
	})

	// TODO: parse response
	c.socket.Send(1, string(payload))
	return nil
}

func (c *Client) SetActivity(args Activity) error {
	payload, _ := json.Marshal(Payload[SetActivityCommandArgs]{
		"SET_ACTIVITY",
		SetActivityCommandArgs{
			Pid:      os.Getpid(),
			Activity: args,
		},
		getNonce(),
	})

	// TODO: parse response
	c.socket.Send(1, string(payload))
	return nil
}

func NewClient(clientId string) *Client {
	socket, err := ipc.NewConnection()

	if err == nil {
		payload, _ := json.Marshal(Handshake{"1", clientId})
		socket.Send(0, string(payload))
	}

	return &Client{
		socket: *socket,
	}
}
