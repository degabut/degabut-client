//go:build !windows

package ipc

import (
	"net"
	"time"
)

// NewConnection opens the discord-ipc-0 unix socket
func NewConnection() (*IPCSock, error) {
	sock, err := net.DialTimeout("unix", GetIpcPath()+"/discord-ipc-0", time.Second*2)
	if err != nil {
		return nil err
	}

	return &IPCSock{sock}, nil
}