import { useEffect, useState } from 'react'
import './mainPage.css'

export default function Main(){

    // BUILD THE IMAGE ARRAY TO MAP THE BLOCKS
    const [arrayImagens, setArrayImagens] = useState([])
    useEffect(() => {
        const arquivosImagens = require.context('../img', false, /\.(png|jpe?g|svg)$/)
        const imagens = arquivosImagens.keys().map(element => element.slice(1).slice(0, -4))
        setArrayImagens(imagens)
    },[])

    // BUILD THE DATA ARRAY WITH THE IMAGE ARRAY LENGTH
    const [arrayWins, setArrayWins] = useState([])
    useEffect(() => {
        if(arrayImagens.length>0){
            setArrayWins(Array(arrayImagens.length).fill(0))
        }
    },[arrayImagens])

    // BUILD THE SAVE ON LOCAL STORAGE
    const [loadedData, setLoadedData] = useState(false)
    useEffect(() => {
        if(arrayWins.length>0 && loadedData == false){
            if(!localStorage.getItem('Player data')){
                localStorage.setItem('Player data', JSON.stringify(arrayWins))
            }else{
                setLoadedData(true)
                setArrayWins(JSON.parse(localStorage.getItem('Player data')))
            }
        }
    },[arrayWins])

    // CHANGE THE DATA BY BUTTON CLICK
    function saveStreakChange(n, index){
        let updatedArray = [...arrayWins]
        if(n == 0){
            updatedArray[index] = 0
        }else if(n == 1){
            updatedArray[index] += n
        }else if(n == -1 && updatedArray[index] >0){
            updatedArray[index] += n
        }
        setArrayWins(updatedArray)
        localStorage.setItem('Player data', JSON.stringify(updatedArray))
    }


    const [message, setMessage] = useState()
    function saveOnClipBoard(){
        let data = [...arrayWins]
        setMessage('Progress saved on clipboard!')
        document.getElementById('save-data').value = data
        localStorage.setItem('Player data', JSON.stringify(arrayWins))
        navigator.clipboard.writeText(data)
    }

    function resetAll(){
        setArrayWins(Array(arrayImagens.length).fill(0))
        setMessage('Progress erased!')
        document.getElementById('save-data').value = ''
        localStorage.setItem('Player data', JSON.stringify(Array(arrayImagens.length).fill(0)))
    }

    function loadSave(){
        let data = document.getElementById('save-data').value
        let arrayData = data.split(',').map(Number)
        if(arrayData.length == arrayImagens.length){
            setArrayWins(arrayData)
            setMessage('Progress loaded!')
            localStorage.setItem('Player data', JSON.stringify(arrayData))
        }else{
            setMessage('Invalid format.')
        }
    }
    

    return (
        <>
        <div className="entire-block">
            <div className="top-bottom">
                <h1>Win Streak Counter</h1>
            </div>
            <div className="main">
                <div className='save-block'>
                    <div id='info-text'>
                        <p>Your progress is saved automatically in your browser. But if you want to bring it somewhere else, you can do it by saving into your clipboard.</p>
                    </div>
                    <input type='text' id='save-data' placeholder=''></input>
                    <div className='btn-line' style={{margin:'15px 0 0 0'}}>
                        <button onClick={resetAll} className='reset-data btn-imagem'>RESET</button>
                        <button onClick={loadSave} className='load-inputed-data btn-imagem'>LOAD</button>
                        <button onClick={saveOnClipBoard} className='save-loaded-data btn-imagem'>SAVE</button>
                    </div>
                    <div id='msg'>
                        {message}
                    </div>
                </div>
                <div id='grade-imagens'>
                    {arrayImagens.map((image, index) => (
                        <div key={index}>
                            <div className='bloco-imagem'>
                                <img src={require('../img' + image + '.png')} alt={`Imagem ${index}`} className='img-style'/>
                                <b className='nome-killer'>{("The" + image.slice(8).slice(0, -9)).replace(/([a-z])([A-Z])/g, '$1 $2')}</b>
                                <b className='qtd-wins'>{arrayWins[index] ? arrayWins[index] : 0}</b>
                                <div className='btn-line'>
                                    <button className='btn-limpar btn-imagem' onClick={() => {saveStreakChange(0, index)}}><i className="fa-solid fa-xmark"></i></button>
                                    <button className='btn-remover btn-imagem' onClick={() => {saveStreakChange(-1, index)}}><i className="fa-solid fa-minus"></i></button>
                                    <button className='btn-add btn-imagem' onClick={() => {saveStreakChange(1, index)}}><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
            <div className="top-bottom">
                <h2>Developed by <a target='_blank' rel='noreferrer' href='https://steamcommunity.com/id/bodebee'>Bodde</a></h2>  
                <h3>Version 0.1.0</h3>               
            </div>
        </div>
        </>
    )
}