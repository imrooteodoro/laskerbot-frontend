import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import '../assets/laskerbot.png'

function ChatBot() {
  const [mensagem, setMensagem] = useState('')
  const [historicoDeMensagens, setHistoricoDeMensagens] = useState([])
  const [aberto, setAberto] = useState(false)
  const [digitando, setDigitando] = useState({usuario: false, bot: false})
  const fimDoHistoricoRef = useRef(null)
  
  const  apiUrl = 'http://10.0.0.108:5000/dialogflow'

  const enviarMensagem = async () => {
   
    setDigitando({...digitando, usuario: true})
    try {
      const resposta = await axios.post(apiUrl, {
        mensagem,
      })
      setDigitando({...digitando, usuario: false, bot: true})
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
      setDigitando({...digitando, bot: false})
    } catch (erro) {
      console.error(erro)
    }
  }

  useEffect(() => {
    fimDoHistoricoRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [historicoDeMensagens])

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
            {digitando.usuario && (
              <div className="mensagem usuario">
                <span className="digitando">...</span>
              </div>
            )}
            {digitando.bot && (
              <div className="mensagem bot">
                <span className="digitando">...</span>
              </div>
            )}
            <div ref={fimDoHistoricoRef} />
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
