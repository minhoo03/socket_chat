const express = require('express')
const socket = require('socket.io')
const http = require('http')
const fs = require('fs')
const port = 8082

const app = express()
const server = http.createServer(app)

const io = socket(server)

// 아래 서버 코드를 돌리기 전에 미리 거치고 가는 함수 : 미들웨어
app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/',(req, res) => {
    fs.readFile('./static/index.html', (err, data) => {
        if(err) {
            res.send(err)
        } else {
            res.writeHead(200, {'Content-Type':'text/html'})
            res.write(data)
            res.end()
        }
    })
})

io.sockets.on('connection' , (socket) => {

    // 새로운 유저 접속 -> 다른 소켓에게 알림 함수
    socket.on('newUser', (name) => {
        console.log(name + ' 님이 접속하셨습니다.')

        // 클라에게 받은 닉네임을 소켓에 저장
        socket.name = name

        // 모든 소켓에게 내용 전송
        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하셨습니다.'})
    })

    // 메세지 전송 / 받기
    socket.on('message', (data) => {
        // 내 닉네임을 담음 (내 닉네임 + 메시지 내용 -> 나를 제외한 모두에게 보냄)
        data.name = socket.name

        // 보낸 사람을 제외한 나머지 소켓에게 메시지 전송
        socket.broadcast.emit('update', data)
    })

    socket.on('disconnect', () => {
        console.log('접속 종료')

        // 나간 사람을 제외한 나머지 유저에게 메시지 전송
        socket.broadcast.emit('update', {type: 'disconnect', name :'SERVER', message: socket.name + '님이 나가셨습니다.'})
    })
})

server.listen(port, () => console.log(`Open server! -> http://localhost:${port}`))