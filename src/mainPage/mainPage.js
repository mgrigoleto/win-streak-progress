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

    function resetStreak(i){
        let temp = [...arrayWins]
        temp[i] = 0
        setArrayWins(temp)
        localStorage.setItem('Player data', JSON.stringify(temp))
    }

    function resetBest(i){
        let temp = [...arrayBest]
        temp[i] = 0
        setArrayBest(temp)
        localStorage.setItem('Player best', JSON.stringify(temp))
    }

    function saveStreakChange(value, i, manualInput){
        let winsTemp = [...arrayWins]
        if(manualInput && value > 0){
            winsTemp[i] = value
        } else {
            winsTemp[i] = winsTemp[i] + value > 0 ? winsTemp[i] += value : 0
        }
        setArrayWins(winsTemp)
        localStorage.setItem('Player data', JSON.stringify(winsTemp))

        if(winsTemp[i] > arrayBest[i]){
            let bestTemp = [...arrayBest]
            bestTemp[i] = winsTemp[i]
            setArrayBest(bestTemp)
            localStorage.setItem('Player best', JSON.stringify(bestTemp))
        }
    }
   

    return (
        <>
        <div className="entire-block">
            <div className="top-bottom top">
                <h1>Dead by Daylight Streak Counter</h1>
            </div>
            <div className="main">
                <div id='grade-imagens'>
                    {arrayImagens.map((image, index) => (
                        <div className={arrayBest[index] >= 50 ? 'win-card card' : 'card'} key={index}>
                            <div className='bloco-imagem'>
                                <b style={{color: arrayBest && arrayBest[index] >= 50 ? "yellow" : "inherit"}}  id='nome-killer'>{(image.slice(5).slice(0, -9)).replace(/([a-z])([A-Z])/g, '$1 $2')}</b>
                                <div className='portrait-frame'>
                                    <img src={require('../img' + image + '.png')} alt={`Imagem ${index}`} className='img-style' title={(image.slice(5).slice(0, -9)).replace(/([a-z])([A-Z])/g, '$1 $2') == 'The Pig' ? "Mommy <3" : null}/>
                                </div>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'170px', fontSize:'17px', margin:'0 0 10px 0'}}>
                                    <b className='qtd-wins' title='Wins'>Current: {arrayWins ? arrayWins[index] : 0}</b>
                                    <b className='player-best-text'>Best: {arrayBest ? arrayBest[index] : 0}</b>                                    
                                </div>
                                <div className='btn-line'>
                                    <button className='btn-imagem' onClick={() => {saveStreakChange(-1, index, false)}}  title='Decrease one'><i className="fa-solid fa-minus"></i></button>
                                    <button className='btn-imagem' onClick={() => {saveStreakChange(1, index, false)}} title='Increase one'><i className="fa-solid fa-plus"></i></button>
                                    <button className='btn-clear btn-imagem' onClick={() => {resetStreak(index)}} title='Reset streak'><i className="fa-solid fa-rotate"></i></button>
                                    <button className='btn-reset btn-imagem' onClick={() => {resetBest(index)}} title='Delete data'><i className="fa-solid fa-trash"></i></button>
                                </div> 
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
            <div className="top-bottom bottom">
                <b>Your progress is stored in the browser cache. This website isn't affiliated with Behaviour Interactive or Dead by Daylight.</b> 
                <b style={{margin:'10px 0'}}>Developed by <a target='_blank' rel='noreferrer' href='https://steamcommunity.com/id/bodd3'>Bodd3</a></b>  
                <b>Version 0.6.1</b>             
            </div>
        </div>
        </>
    )
}
