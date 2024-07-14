import React, {useState} from 'react'
import axios from 'axios'
import '../assets/laskerbot.png'

function ChatBot() {
  const [mensagem, setMensagem] = useState('')
  const [historicoDeMensagens, setHistoricoDeMensagens] = useState([])
  const [aberto, setAberto] = useState(false)

  const enviarMensagem = async () => {
    try {
      const resposta = await axios.post('http://10.0.0.108:5000/dialogflow', {
        mensagem,
      })
      const respostaFormatada = resposta.data.resposta_do_bot.replace(
        /\\n/g,
        '<br/>',
      )
      setHistoricoDeMensagens([
        ...historicoDeMensagens,
        {tipo: 'usuario', texto: mensagem},
        {tipo: 'bot', texto: respostaFormatada},
      ])
      setMensagem('')
    } catch (erro) {
      console.error(erro)
    }
  }

  return (
    <div>
      <button
        className="botao-chatbot"
        onClick={() => setAberto(!aberto)}></button>
      {aberto && (
        <div className="chatbot">
          <div className="historico">
            {historicoDeMensagens.map((msg, index) => (
              <div key={index} className={`mensagem ${msg.tipo}`}>
                <p dangerouslySetInnerHTML={{__html: msg.texto}}></p>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={mensagem}
            placeholder="Insira sua mensagem aqui"
            onChange={e => setMensagem(e.target.value)}
          />
          <button onClick={enviarMensagem}>Enviar</button>
        </div>
      )}
    </div>
  )
}

export default ChatBot
