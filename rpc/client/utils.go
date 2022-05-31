package client

import (
	"crypto/rand"
	"fmt"
)

func getNonce() string {
	buf := make([]byte, 16)
	rand.Read(buf)

	buf[6] = (buf[6] & 0x0f) | 0x40

	return fmt.Sprintf("%x-%x-%x-%x-%x", buf[0:4], buf[4:6], buf[6:8], buf[8:10], buf[10:])
}
