import { useEffect, useState } from 'react'
import './mainPage.css'

export default function Builder(){

    // BUILD THE IMAGE ARRAY TO MAP THE BLOCKS
    const [arrayImagens, setArrayImagens] = useState([])
    useEffect(() => {
        const arquivosImagens = require.context('../img', false, /\.(png|jpe?g|svg)$/)
        const imagens = arquivosImagens.keys().map(element => element.slice(1).slice(0, -4))
        setArrayImagens(imagens)
    },[])

    // BUILD THE DATA ARRAY WITH THE IMAGE ARRAY LENGTH
    const [arrayWins, setArrayWins] = useState([])
    const [arrayBest, setArrayBest] = useState([])
    useEffect(() => {
        if(arrayImagens.length>0){
            setArrayWins(Array(arrayImagens.length).fill(0))
            setArrayBest(Array(arrayImagens.length).fill(0))
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
                let tempArray = JSON.parse(localStorage.getItem('Player data'))
                if(tempArray.length < arrayImagens.length){
                    for(let i=0;i<(arrayImagens.length - tempArray.length);i++){
                        tempArray.push(0)
                    }
                }
                setArrayWins(tempArray)
            }
        }
    },[arrayWins])

    // BUILD THE PLAYER BEST SAVE ON LOCAL STORAGE
    const [loadedPlayerBest, setLoadedPlayerBest] = useState(false)
    useEffect(() => {
        if(arrayBest.length>0 && loadedPlayerBest == false){
            if(!localStorage.getItem('Player best')){
                localStorage.setItem('Player best', JSON.stringify(arrayBest))
            }else{
                setLoadedPlayerBest(true)
                let tempArray = JSON.parse(localStorage.getItem('Player best'))
                if(tempArray.length < arrayImagens.length){
                    for(let i=0;i<(arrayImagens.length - tempArray.length);i++){
                        tempArray.push(0)
                    }
                }
                setArrayBest(tempArray)
            }
        }
    },[arrayBest])

    // SET THE DATA ON THE INPUTS
    useEffect(() => {
        if(arrayWins.length>0 ){
            for(let i=0; i<arrayWins.length; i++){
                document.getElementById("wins-amount"+i).value = arrayWins[i] ? arrayWins[i] : 0
            }
        }
    },[arrayWins])

    // CHANGE THE DATA
    function saveStreakChange(n, index, action, type){
        let updatedArray = [...arrayWins]
        let playerBestArray = [...arrayBest]
        if(action == 'add'){
            updatedArray[index] += n
            playerBestArray[index] = updatedArray[index] > playerBestArray[index] ? updatedArray[index] : playerBestArray[index]

        }else if(action == 'del' && updatedArray[index] > 0){
            updatedArray[index] += n

        }else if(n > 0 || !n){
            updatedArray[index] = n ? n : 0
            playerBestArray[index] = updatedArray[index] > playerBestArray[index] ? updatedArray[index] : playerBestArray[index]

        }
        setArrayWins(updatedArray)
        localStorage.setItem('Player data', JSON.stringify(updatedArray))
        setArrayBest(playerBestArray)
        localStorage.setItem('Player best', JSON.stringify(playerBestArray))
    }

    const [message, setMessage] = useState()
    const [messageColor, setMessageColor] = useState('white')
    function saveOnClipBoard(){
        let data = [...arrayWins]
        let best = [...arrayBest]
        setMessageColor('blue')
        setMessage('Progress saved on clipboard!')
        setTimeout(() => {
            setMessage('')
        }, 3000)
        let loadedData = data + ';' + best
        document.getElementById('save-data').value = loadedData
        localStorage.setItem('Player data', JSON.stringify(arrayWins))
        localStorage.setItem('Player best', JSON.stringify(arrayBest))
        navigator.clipboard.writeText(loadedData)
    }

    function resetAll(){
        setArrayWins(Array(arrayImagens.length).fill(0))
        setArrayBest(Array(arrayImagens.length).fill(0))
        setMessageColor('rgb(102, 0, 46)')
        setMessage('Progress erased!')
        setTimeout(() => {
            setMessage('')
        }, 3000)
        document.getElementById('save-data').value = ''
        localStorage.setItem('Player data', JSON.stringify(Array(arrayImagens.length).fill(0)))
        localStorage.setItem('Player best', JSON.stringify(Array(arrayImagens.length).fill(0)))
    }

    function resetStreak(i){
        let temp = [...arrayWins]
        temp[i] = 0
        setArrayWins(temp)
        localStorage.setItem('Player data', JSON.stringify(temp))
    }

    function loadSave(){
        let value = document.getElementById('save-data').value
        if(value && value.includes(';')){
            let data = value.split(";")
            let arrayDataWins = data[0].split(',').map(Number)
            let arrayDataBest = data[2].split(',').map(Number)

            if(arrayDataWins.length == arrayImagens.length && arrayImagens.length == arrayDataBest.length){
                setArrayWins(arrayDataWins)
                setArrayBest(arrayDataBest)
                setMessageColor('rgb(0, 191, 255)')
                setMessage('Progress loaded!')
                setTimeout(() => {
                    setMessage('')
                }, 3000)
                localStorage.setItem('Player data', JSON.stringify(arrayDataWins))
                localStorage.setItem('Player best', JSON.stringify(arrayDataBest))
            }else{
                setMessageColor('red')
                setMessage('Invalid format.')
                setTimeout(() => {
                    setMessage('')
                }, 3000)
            }
        }else{
            setMessageColor('red')
            setMessage('Invalid format.')
            setTimeout(() => {
                setMessage('')
            }, 3000)
        }
    }
    

    return (
        <>
        <div className="entire-block">
            <div className="top-bottom">
                <h1>Dead by Daylight Streak Counter</h1>
            </div>
            <div className="main">
                <div className='save-block'>
                    {/* <div id='info-text'>
                        <p>Your progress is saved automatically in your browser. But if you want to bring it somewhere else, you can do it by saving into your clipboard.</p>
                    </div> */}
                    <input type='text' id='save-data' placeholder=''></input>
                    <div className='btn-line btn-line-input' style={{margin:'15px 0 0 0'}}>
                        <button onClick={resetAll} className='reset-data btn-imagem'>RESET</button>
                        <button onClick={loadSave} className='load-inputed-data btn-imagem'>LOAD</button>
                        <button onClick={saveOnClipBoard} className='save-loaded-data btn-imagem'>SAVE</button>
                    </div>
                    <div id='msg' style={{color:messageColor}}>
                        {message}
                    </div>
                </div>
                <div id='grade-imagens'>
                    {arrayImagens.map((image, index) => (
                        <div className={arrayWins[index] >= arrayBest[index] && arrayBest[index] > 0 ? 'golden-card card' : 'card'} style={{border: arrayWins[index] >= arrayBest[index] && arrayBest[index] > 0 ? '2px solid rgb(255, 215, 0)' : '2px solid rgb(0, 0, 144)', boxShadow: arrayWins[index] >= arrayBest[index] && arrayBest[index] > 0 ? '4px 4px rgb(255, 215, 0)' : '4px 4px rgb(0, 0, 144)'}} key={index}>
                            <div className='bloco-imagem'>
                                <div className='portrait-frame'>
                                    <img src={require('../img' + image + '.png')} alt={`Imagem ${index}`} className='img-style' title={(image.slice(5).slice(0, -9)).replace(/([a-z])([A-Z])/g, '$1 $2') == 'The Pig' ? "Mommy <3" : null}/>
                                </div>
                                <b className='nome-killer'>{(image.slice(5).slice(0, -9)).replace(/([a-z])([A-Z])/g, '$1 $2')}</b>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'right', width:'170px'}}>
                                    <div style={{width:'100%', textAlign:'left'}}>
                                        <b className='qtd-wins' title='Wins'>W</b>
                                    </div>
                                    
                                    <input min="0" id={"wins-amount"+index} className='input-killer' onChange={(e) => {saveStreakChange(parseInt(e.target.value), index, null, 'win')}}></input>

                                    <div className='btn-line'>
                                        <button className='btn-remover btn-imagem' onClick={() => {saveStreakChange(-1, index, 'del', 'win')}}  title='Decrease one'><i className="fa-solid fa-minus"></i></button>
                                        <button className='btn-add btn-imagem' onClick={() => {saveStreakChange(1, index, 'add', 'win')}} title='Increase one'><i className="fa-solid fa-plus"></i></button>
                                    </div>
                                    
                                </div>

                                <div style={{display:'flex', alignItems:'center', justifyContent:'right', width:'170px'}}>
                                    <button className='reset-button btn-imagem' onClick={() => {resetStreak(index)}}>RESET</button>                                    
                                </div>

                                <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:'170px'}}>
                                    <b className='player-best-text'>Player best: {arrayBest ? arrayBest[index] : 0}</b>
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
            <div className="top-bottom bottom">
                <div style={{textAlign:'left'}}>
                    <b>This website isn't affiliated with Behaviour Interactive or Dead by Daylight.</b>  
                </div>  
                <div style={{display:'flex', flexDirection:'column', textAlign:'right'}}>
                    <b style={{margin:'0 0 10px 0'}}>Developed by <a target='_blank' rel='noreferrer' href='https://steamcommunity.com/id/bodd3'>Bodd3</a></b>  
                    <b>Version 0.4.0</b>  
                </div>             
            </div>
        </div>
        </>
    )
}