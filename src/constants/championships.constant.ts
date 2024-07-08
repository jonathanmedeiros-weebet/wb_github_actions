import { gameList } from "./games.contant";

export const championshipList = [
    {
        title: 'Campeonato brasileiro',
        image: 'src/assets/images/mocks/circle-flags_br.png',
        games: gameList
    },
    {
        title: 'Campeonato brasileiro sub16',
        image: 'src/assets/images/mocks/circle-flags_br.png',
        games: [ 
            {
                dateTime: '28/05 09:00',
                pontuation: '+150',
                teams: [
                    {
                        name: 'Manchester United2',
                        image: 'src/assets/images/mocks/atletico.png',
                    },
                    {
                        name: 'Caracas2',
                        image: 'src/assets/images/mocks/fortaleza.png',
                    }
                ],
                quotes: {
                    visitor: '1.00',
                    host: '7.00',
                    draw: '2.54'
                },
                results: [
                    {
                        team0: 5,
                        team1: 2
                    },
                    {
                        team0: 1,
                        team1: 3
                    }
                ]
            },
            {
                dateTime: '28/05 09:00',
                pontuation: '+150',
                teams: [
                    {
                        name: 'Manchester United3',
                        image: 'src/assets/images/mocks/atletico.png',
                    },
                    {
                        name: 'Caracas3',
                        image: 'src/assets/images/mocks/fortaleza.png',
                    }
                ],
                quotes: {
                    visitor: '1.00',
                    host: '7.00',
                    draw: '2.54'
                },
                results: [
                    {
                        team0: 5,
                        team1: 2
                    },
                    {
                        team0: 1,
                        team1: 3
                    }
                ]
            },
        ]
    },
    {
        title: 'Campeonato brasileiro sub20',
        image: 'src/assets/images/mocks/circle-flags_br.png',
        games: gameList
    },
    {
        title: 'Copa do brasil',
        image: 'src/assets/images/mocks/circle-flags_br.png',
        games: gameList
    },
    {
        title: 'Copa do brasil',
        image: 'src/assets/images/mocks/circle-flags_br.png',
        games: gameList
    },
]