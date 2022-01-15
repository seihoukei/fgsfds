import Game from "./game.js"
import UI from "./ui.js"

window.onload = async () => {

    window.stopServiceWorkerLoader?.()
    document.getElementById("loader").remove()

    window.ui = new UI()
    window.newGame = newGame

    const options = Object.assign({}, Game.DEFAULT_OPTIONS)

    try {
        if (localStorage.fgsfds_options !== undefined) {
            const stored = JSON.parse(localStorage.fgsfds_options)
            Object.assign(options, stored)
        }
    } finally {
        newGame(options)
    }
}

function newGame(options) {
    window.game = new Game(options)
    ui.showGame(game)
}