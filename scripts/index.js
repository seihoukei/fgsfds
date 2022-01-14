import Game from "./game.js"
import UI from "./ui.js"

window.onload = async () => {

    window.stopServiceWorkerLoader?.()
    document.getElementById("loader").remove()

    window.ui = new UI()
    window.newGame = newGame

    const options = Game.DEFAULT_OPTIONS

    try {
        if (localStorage.fgsfds_options !== undefined) {
            const stored = JSON.parse(localStorage.fgsfds_options)
            Object.assign(options, stored)
        }
    } finally {
        newGame(options)
    }
}

function newGame(start, size) {
    window.game = new Game(start, size)
    ui.showGame(game)
}