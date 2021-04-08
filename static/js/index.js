var socket = io()

socket.on('connect', () => {

    var name = prompt('닉네임을 정하세요','')

    // 이름 = null
    if(!name) {
        name = '익명'+count
    }

    // 서버에 'name' 유저가 온걸 알림
    socket.emit('newUser', name)
})

// 메시지 전송 - 콘솔
socket.on('update', (data) => {
    console.log(`${data.name}: ${data.message}`)

    // 다른 사람이 보낸걸 받은거므로
    // (타입 따지는 이유 : 메세지인지, 접속인지, 접종인지)
    // 메세지면 보낸 사람 이름과 내용, 배경색을 달리함
    var chat = document.getElementById('chat')
    var message = document.createElement('div')
    var m_container = document.createElement('p') // div를 감싸는 p 태그
    var m_name = document.createElement('p') // 이름
    var m_content = document.createElement('div') // 내용
    var name = document.createTextNode(`${data.name}`); // 이름 콘텐츠...
    var node = document.createTextNode(`${data.name}: ${data.message}`)
    var className = ''

    switch(data.type) {
        case 'message' : 
            className = 'other'
            name = document.createTextNode(`${data.name}`);
            node = document.createTextNode(`${data.message}`);
            
            m_container.classList.add('p_chat')
            m_name.classList.add('name-other')
            m_content.classList.add(className)

            
            m_name.appendChild(name)
            m_content.appendChild(node)
            m_container.appendChild(m_name)
            m_container.appendChild(m_content)
            chat.appendChild(m_container)

            break

        case 'connect' :
            className = 'connect'
            message.classList.add(className)
            message.appendChild(node)
            chat.appendChild(message)
            break

        case 'disconnect' :
            className = 'disconnect'
            message.classList.add(className)
            message.appendChild(node)
            chat.appendChild(message)
            break
    }

    // message.classList.add(className)
    // message.appendChild(node)
    // chat.appendChild(message)
})

function enterkey() {
    if(window.event.keyCode == 13) {
        send()
    }
}

// 메시지 전송 함수
function send() {


    // 입력된 value 가져옴
    var message = document.getElementById('test').value
    document.getElementById('test').value = ''


    // 내가 보낸 메세지는 배경색, 보낸 사람 이름 신경 안써도 된다.
    var chat = document.getElementById('chat')
    var msg_container = document.createElement('p');
    var msg_name = document.createElement('p');
    var msg_content = document.createElement('div');
    var name = document.createTextNode('나')
    var node = document.createTextNode(message)

    msg_container.classList.add('p_chat')
    msg_name.classList.add('name-me')
    msg_content.classList.add('me')

    msg_name.appendChild(name)
    msg_content.appendChild(node)
    msg_container.appendChild(msg_name)
    msg_container.appendChild(msg_content)
    chat.appendChild(msg_container)


    // 서버로 message 이벤트 전달 + 데이터와 함께
    // update + 'data' <= data임 ↓
    socket.emit('message', {type: 'message', message : message})
}